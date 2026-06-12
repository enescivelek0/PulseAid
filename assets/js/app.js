import { emergencyData } from './data.js';

// State management and app controller
const state = {
  lang: 'tr',
  caseId: null,
  choice: null,
  stepIndex: 0
};

// Timer variables
let timerInterval = null;
let timerSecondsLeft = 0;
let timerIsRunning = false;

// Audio Metronome variables
let audioCtx = null;
let visualRhythmInterval = null;
let metronomeAudioEnabled = false;

// Voice Synthesis variables
let speechEnabled = false;
let synthesisVoice = null;

// GPS variables
let gpsTrackingActive = false;
let userLocation = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Initial parsing from URL
  parseUrlParams();

  // Listen for browser Back/Forward navigation
  window.addEventListener('popstate', () => {
    parseUrlParams();
    renderApp();
  });

  // Set up global click handlers for language selection
  document.getElementById('lang-tr').addEventListener('click', () => setLanguage('tr'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

  // Start GPS geolocation tracking passively
  initGpsTracking();

  // Initial render
  renderApp();
});

// Set language helper
function setLanguage(lang) {
  state.lang = lang;
  updateUrl();
  renderApp();
  updateGpsDisplay();
}

// Parse URL search parameters to sync state
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Language (default to Turkish if not specified or invalid)
  const lang = params.get('lang');
  state.lang = (lang === 'en' || lang === 'tr') ? lang : 'tr';
  
  // Case ID
  state.caseId = params.get('case');
  
  // Choice (decision branch)
  state.choice = params.get('choice');
  
  // Step index
  const step = parseInt(params.get('step'), 10);
  state.stepIndex = isNaN(step) ? 0 : step;
}

// Update URL based on state
function updateUrl() {
  const params = new URLSearchParams();
  params.set('lang', state.lang);
  
  if (state.caseId) {
    params.set('case', state.caseId);
  }
  if (state.choice) {
    params.set('choice', state.choice);
  }
  if (state.stepIndex > 0) {
    params.set('step', state.stepIndex);
  }
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState(null, '', newUrl);
}

// Reset state to home
function navigateToHome() {
  state.caseId = null;
  state.choice = null;
  state.stepIndex = 0;
  cleanupRhythmsAndTimers();
  stopSpeaking();
  updateUrl();
  renderApp();
}

// Navigate back one step in decision tree
function navigateBack() {
  cleanupRhythmsAndTimers();
  stopSpeaking();
  if (state.stepIndex > 0) {
    state.stepIndex--;
  } else if (state.choice) {
    state.choice = null;
  } else if (state.caseId) {
    state.caseId = null;
  }
  updateUrl();
  renderApp();
}

// Cleanup audio context, timers, and intervals
function cleanupRhythmsAndTimers() {
  // Stop audio and visual metronome
  if (visualRhythmInterval) {
    clearInterval(visualRhythmInterval);
    visualRhythmInterval = null;
  }
  
  // Stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerIsRunning = false;
  timerSecondsLeft = 0;
}

// Play a synthesized electronic sound using Web Audio API (completely offline-ready)
function playMetronomeTick() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Frequency of tone: 800Hz is a clear, medical alert tone
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    
    // Envelope: sharp attack, fast decay
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.06);
  } catch (e) {
    console.error("Audio Context error: ", e);
  }
}

// Flash visual indicators during metronome beats
function triggerVisualTick(isGreen = false) {
  const metroDots = document.querySelectorAll('.metro-circle');
  const flashClass = isGreen ? 'flash-green' : 'flash';
  
  metroDots.forEach(dot => {
    dot.classList.add(flashClass);
    setTimeout(() => {
      dot.classList.remove(flashClass);
    }, 80);
  });
}

// Set up metronome timer based on active BPM
function setupMetronome(bpm, isGreen = false) {
  cleanupRhythmsAndTimers();
  if (!bpm) return;

  const intervalMs = 60000 / bpm;
  
  visualRhythmInterval = setInterval(() => {
    // Flash visuals
    triggerVisualTick(isGreen);
    
    // Play tick if audio is enabled
    if (metronomeAudioEnabled) {
      playMetronomeTick();
    }
  }, intervalMs);
}

// Toggle audio metronome state
function toggleMetronomeAudio(enabled) {
  metronomeAudioEnabled = enabled;
  
  // Initialize audio context on user action to satisfy browser security
  if (metronomeAudioEnabled && !audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {}
  }
}

// Text-to-Speech Voice Guidance (Web Speech API)
function initTextToSpeech() {
  if ('speechSynthesis' in window) {
    // Warm up the voices list
    window.speechSynthesis.getVoices();
  }
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Select appropriate voice based on lang
  utterance.lang = state.lang === 'tr' ? 'tr-TR' : 'en-US';
  utterance.rate = 0.95; // Slightly slower speed for emergencies
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function toggleVoiceGuidance(checkbox) {
  speechEnabled = checkbox.checked;
  if (speechEnabled) {
    // Speak current step immediately on activation
    const currentStepText = document.getElementById('instruction-text')?.textContent;
    if (currentStepText) speakText(currentStepText.trim());
  } else {
    stopSpeaking();
  }
}

// GPS Location Tracking
function initGpsTracking() {
  if (!navigator.geolocation) return;
  
  // Active watch tracker
  navigator.geolocation.watchPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude.toFixed(5),
        lng: position.coords.longitude.toFixed(5),
        accuracy: Math.round(position.coords.accuracy)
      };
      gpsTrackingActive = true;
      updateGpsDisplay();
    },
    (error) => {
      console.warn("GPS Location fetch error:", error);
      gpsTrackingActive = false;
      updateGpsDisplay();
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}

function updateGpsDisplay() {
  const gpsIndicator = document.getElementById('gps-indicator');
  if (!gpsIndicator) return;
  
  if (gpsTrackingActive && userLocation) {
    const coordsStr = `📍 Lat: ${userLocation.lat}, Lng: ${userLocation.lng} (±${userLocation.accuracy}m)`;
    gpsIndicator.innerHTML = `
      <div class="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="tracking-wide">${coordsStr}</span>
      </div>
    `;
  } else {
    const statusText = state.lang === 'tr' ? '📍 GPS Bekleniyor' : '📍 GPS Waiting';
    gpsIndicator.innerHTML = `
      <button onclick="window.requestGpsPermission()" class="flex items-center space-x-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:bg-white/10 hover:text-white transition">
        <span>${statusText}</span>
      </button>
    `;
  }
}

function requestGpsPermission() {
  initGpsTracking();
}

// Render main shell translations and display the correct screen
function renderApp() {
  const langData = emergencyData[state.lang];
  
  // Set Lang UI toggle buttons
  if (state.lang === 'tr') {
    document.getElementById('lang-tr').classList.add('bg-white/20', 'text-white');
    document.getElementById('lang-tr').classList.remove('text-gray-400');
    document.getElementById('lang-en').classList.remove('bg-white/20', 'text-white');
    document.getElementById('lang-en').classList.add('text-gray-400');
  } else {
    document.getElementById('lang-en').classList.add('bg-white/20', 'text-white');
    document.getElementById('lang-en').classList.remove('text-gray-400');
    document.getElementById('lang-tr').classList.remove('bg-white/20', 'text-white');
    document.getElementById('lang-tr').classList.add('text-gray-400');
  }

  // Update footer dialer content dynamic text
  const emergencyNum = state.lang === 'tr' ? '112' : '911';
  const dialerBtn = document.getElementById('emergency-dialer');
  if (dialerBtn) {
    dialerBtn.href = `tel:${emergencyNum}`;
    dialerBtn.innerHTML = `
      <span class="relative flex h-3 w-3 mr-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <span class="font-extrabold text-lg tracking-wider">${state.lang === 'tr' ? '📞 112 ACİL ARA' : '📞 DIAL 911 URGENT'}</span>
    `;
  }

  const appContainer = document.getElementById('app-container');
  appContainer.innerHTML = ''; // Clear container

  // Screen routing logic
  if (!state.caseId) {
    // SCREEN 1: Emergency Selector
    renderSelectorScreen(appContainer, langData);
  } else {
    const selectedCase = langData.cases[state.caseId];
    if (!selectedCase) {
      navigateToHome();
      return;
    }
    
    if (!state.choice) {
      // SCREEN 2: Decision Tree Questions (Binary choice)
      renderDecisionScreen(appContainer, selectedCase, langData);
    } else {
      const selectedOption = selectedCase.options[state.choice];
      if (!selectedOption || !selectedOption.steps[state.stepIndex]) {
        navigateToHome();
        return;
      }
      
      // SCREEN 3: Action Room
      renderActionRoomScreen(appContainer, selectedCase, selectedOption, langData);
    }
  }
}

// Render Screen 1: Emergency Selector Grid
function renderSelectorScreen(container, langData) {
  const headerHtml = `
    <div class="text-center mb-8 animate-fade-in">
      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-white animate-pulse">
        ${langData.title}
      </h1>
      <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        ${langData.subtitle}
      </p>
    </div>
  `;
  
  let gridHtml = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full px-4 mb-8">`;
  
  for (const [key, value] of Object.entries(langData.cases)) {
    const iconSvg = getIconSvg(value.icon, "w-14 h-14 text-crimson group-hover:scale-110 transition-transform duration-300");
    gridHtml += `
      <button onclick="selectCase('${key}')" id="card-${key}" class="glass-card p-6 md:p-8 rounded-2xl text-left flex flex-col justify-between group cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-crimson/50">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-crimson/10 group-hover:border-crimson/30 transition-colors duration-300">
              ${iconSvg}
            </div>
            <svg class="w-6 h-6 text-gray-500 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-coral transition-colors duration-300">${value.title}</h2>
          <p class="text-base md:text-lg text-gray-300 leading-relaxed">${value.description}</p>
        </div>
      </button>
    `;
  }
  gridHtml += `</div>`;

  const bannerHtml = `
    <div class="max-w-3xl mx-auto px-4 text-center">
      <div class="glass-panel py-3 px-5 rounded-full inline-flex items-center space-x-2 text-xs md:text-sm text-gray-300">
        <span class="inline-block w-2.5 h-2.5 rounded-full bg-neonGreen animate-pulse"></span>
        <span>${langData.distanceTip}</span>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.className = 'w-full py-4 screen-transition';
  div.innerHTML = headerHtml + gridHtml + bannerHtml;
  container.appendChild(div);
}

// Select case helper (Screen 1 click)
function selectCase(caseId) {
  state.caseId = caseId;
  state.choice = null;
  state.stepIndex = 0;
  updateUrl();
  renderApp();
}

// Render Screen 2: The Decision Tree
function renderDecisionScreen(container, selectedCase, langData) {
  const iconSvg = getIconSvg(selectedCase.icon, "w-10 h-10 text-crimson mr-3");
  
  const contentHtml = `
    <div class="max-w-3xl mx-auto px-4 py-6">
      <!-- Back Button -->
      <button onclick="navigateBack()" class="glass-btn flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white mb-8">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        ${langData.backBtn}
      </button>

      <div class="glass-panel p-8 rounded-3xl border border-white/10 text-center shadow-3xl">
        <div class="flex justify-center items-center mb-6">
          <div class="p-2.5 bg-white/5 rounded-lg border border-white/10">
            ${iconSvg}
          </div>
          <span class="text-lg uppercase tracking-wider font-semibold text-crimson">${selectedCase.title}</span>
        </div>

        <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-10 leading-snug">
          ${selectedCase.question}
        </h2>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          ${Object.entries(selectedCase.options).map(([key, value]) => `
            <button onclick="selectDecision('${key}')" class="decision-btn w-full sm:w-auto min-w-[200px] py-4 px-6 rounded-2xl font-bold text-xl text-white glass-btn border border-white/15 hover:border-crimson hover:bg-crimson/25 active:scale-95 transition-all duration-200">
              ${value.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.className = 'w-full screen-transition';
  div.innerHTML = contentHtml;
  container.appendChild(div);
}

// Select decision helper (Screen 2 click)
function selectDecision(choiceKey) {
  state.choice = choiceKey;
  state.stepIndex = 0;
  updateUrl();
  renderApp();
}

// Render Screen 3: Action Room
function renderActionRoomScreen(container, selectedCase, selectedOption, langData) {
  const steps = selectedOption.steps;
  const currentStep = steps[state.stepIndex];
  
  // Format total progression string
  const progressPercent = ((state.stepIndex + 1) / steps.length) * 100;
  
  // Check if we have timer or rate
  const hasTimer = typeof currentStep.timer !== 'undefined';
  const hasRate = typeof currentStep.rate !== 'undefined';
  const bpm = currentStep.rate || null;
  const isGreenZone = selectedCase.icon === 'burns' || (selectedCase.icon === 'bleeding' && state.choice === 'oozing');
  
  // Start up periodic cycles
  cleanupRhythmsAndTimers();
  if (hasRate) {
    setupMetronome(bpm, isGreenZone);
  }
  if (hasTimer && timerSecondsLeft === 0 && !timerIsRunning) {
    timerSecondsLeft = currentStep.timer;
  }

  // Trigger TTS guidance if enabled
  if (speechEnabled) {
    speakText(currentStep.text);
  }

  // Animation Vector HTML selection
  const animHtml = getAnimationSvg(currentStep.animation, bpm, isGreenZone);

  const contentHtml = `
    <div class="max-w-6xl mx-auto px-4 py-2">
      <!-- Header row inside Action Room -->
      <div class="flex items-center justify-between mb-4">
        <button onclick="navigateBack()" class="glass-btn flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          ${langData.backBtn}
        </button>
        
        <div class="flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1 border border-white/10">
          <span class="text-xs uppercase tracking-wider font-semibold text-gray-300">${selectedCase.title}</span>
          <span class="text-gray-500">•</span>
          <span class="text-xs font-semibold text-coral">${selectedOption.label}</span>
        </div>
      </div>

      <!-- Main Action Room Panel: Split Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        
        <!-- Left Side: Visual Loop Animation -->
        <div class="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between items-center relative min-h-[300px] lg:min-h-auto shadow-2xl">
          <!-- Top floating rhythm rate if applicable -->
          ${hasRate ? `
            <div class="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-black/30 border border-white/5 rounded-full px-3.5 py-1 text-xs">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isGreenZone ? 'bg-emerald-400' : 'bg-crimson'}"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 ${isGreenZone ? 'bg-emerald-500' : 'bg-crimson'}"></span>
              </span>
              <span class="font-bold text-gray-300">${langData.activeRhythm}: ${bpm} BPM</span>
            </div>
          ` : ''}

          <!-- Centered visual representation -->
          <div class="flex-grow flex items-center justify-center w-full py-4">
            ${animHtml}
          </div>

          <!-- Bottom controls: Metronome -->
          <div class="w-full mt-2 flex flex-col items-center">
            ${hasRate ? `
              <!-- Metronome Beep Switch -->
              <div class="flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-2 hover:bg-white/10 transition duration-150">
                <label for="metronome-audio-toggle" class="text-sm font-semibold text-gray-200 cursor-pointer select-none">${langData.metronomeToggle}</label>
                <div class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="metronome-audio-toggle" onchange="toggleMetronomeAudioCheckbox(this)" ${metronomeAudioEnabled ? 'checked' : ''} class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-transparent appearance-none cursor-pointer focus:outline-none"/>
                  <label for="metronome-audio-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-white/10 cursor-pointer border border-white/10"></label>
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Right Side: Large bold instructions + TTS Assistant -->
        <div class="lg:col-span-7 glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between shadow-2xl relative">
          <div>
            <!-- Step Indicators, voice options -->
            <div class="flex justify-between items-center mb-4">
              <span class="text-sm font-bold text-gray-400 uppercase tracking-widest">${state.lang === 'tr' ? 'Adım' : 'Step'} ${state.stepIndex + 1} / ${steps.length}</span>
              
              <!-- Voice Guidance TTS Switcher -->
              <div class="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                <button onclick="window.speakStepContent()" class="text-gray-400 hover:text-white mr-1.5 focus:outline-none" title="${state.lang === 'tr' ? 'Seslendir' : 'Speak Step'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                </button>
                <span class="text-xs text-gray-300 font-semibold select-none mr-1">${state.lang === 'tr' ? 'Sesli Asistan' : 'Voice Assistant'}</span>
                <div class="relative inline-block w-8 align-middle select-none transition duration-150 ease-in">
                  <input type="checkbox" id="voice-assistant-toggle" onchange="toggleVoiceGuidance(this)" ${speechEnabled ? 'checked' : ''} class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-2 border-transparent appearance-none cursor-pointer focus:outline-none"/>
                  <label for="voice-assistant-toggle" class="toggle-label block overflow-hidden h-4 rounded-full bg-white/10 cursor-pointer border border-white/10"></label>
                </div>
              </div>
            </div>

            <!-- Massive Readable instruction with click-to-speak functionality -->
            <div class="mb-6 min-h-[160px] flex items-start">
              <p id="instruction-text" class="large-readable-text text-white font-extrabold leading-tight select-all">
                ${currentStep.text}
              </p>
            </div>
          </div>

          <!-- Secondary Interaction Panel (Timers, Metronome click indicator) -->
          <div class="mt-auto border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            
            <!-- Dynamic Sub-component Area (Timer or Pulsing light) -->
            <div class="flex-grow flex items-center justify-start min-h-[72px]">
              ${hasTimer ? `
                <!-- Count Down Timer widget -->
                <div class="flex items-center space-x-4 w-full bg-white/5 border border-white/10 rounded-2xl p-3">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xl font-bold">
                    <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div class="flex-grow">
                    <div class="text-2xl font-mono font-bold text-white tracking-widest" id="timer-display">${formatTime(timerSecondsLeft)}</div>
                  </div>
                  <div class="flex space-x-2">
                    <button onclick="toggleActionTimer()" id="timer-ctrl-btn" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-bold text-white transition">
                      ${timerIsRunning ? langData.timerPause : langData.timerStart}
                    </button>
                    <button onclick="resetActionTimer(${currentStep.timer})" class="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold text-gray-300 transition">
                      ${langData.timerReset}
                    </button>
                  </div>
                </div>
              ` : ''}

              ${hasRate && !hasTimer ? `
                <!-- Pulse Circle display -->
                <div class="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                  <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <div class="metro-circle w-6 h-6 rounded-full transition-all duration-75 ${isGreenZone ? 'bg-emerald-500/20' : 'bg-crimson/20'}"></div>
                  </div>
                  <div>
                    <span class="text-sm font-semibold text-gray-400 block uppercase tracking-wider">${state.lang === 'tr' ? 'HIZ ÖLÇER' : 'PULSE RATE'}</span>
                    <span class="text-base font-bold text-white font-mono uppercase">${bpm} BPM</span>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Flow Buttons -->
            <div class="flex space-x-3 shrink-0">
              ${state.stepIndex > 0 ? `
                <button onclick="navigateActionStep(-1)" class="px-5 py-4 border border-white/10 rounded-2xl font-bold text-lg text-gray-300 hover:text-white glass-btn active:scale-95 transition">
                  ${langData.prevBtn}
                </button>
              ` : ''}

              ${state.stepIndex < steps.length - 1 ? `
                <button onclick="navigateActionStep(1)" class="px-6 py-4 rounded-2xl font-bold text-lg text-white active:scale-95 transition flex items-center justify-center ${isGreenZone ? 'bg-emerald-500 hover:bg-emerald-600 pulse-green' : 'bg-crimson hover:bg-crimson-dark pulse-crimson'}">
                  <span>${langData.nextBtn}</span>
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              ` : `
                <button onclick="navigateToHome()" class="px-6 py-4 rounded-2xl font-bold text-lg text-white bg-emerald-500 hover:bg-emerald-600 pulse-green active:scale-95 transition flex items-center justify-center">
                  <span>${langData.finishBtn}</span>
                  <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </button>
              `}
            </div>

          </div>
        </div>
      </div>
      
      <!-- Distance layout hint -->
      <div class="text-center">
        <p class="text-sm text-gray-400 font-semibold">${langData.distanceTip}</p>
      </div>
    </div>
  `;

  const div = document.createElement('div');
  div.className = 'w-full screen-transition';
  div.innerHTML = contentHtml;
  container.appendChild(div);

  // If timer was running prior to re-render, keep it running
  if (hasTimer && timerIsRunning) {
    runTimerCountdown();
  }
}

// Speak step text manually
function speakStepContent() {
  const content = document.getElementById('instruction-text')?.textContent;
  if (content) {
    speakText(content.trim());
  }
}

// Checkbox metronome listener
function toggleMetronomeAudioCheckbox(checkbox) {
  toggleMetronomeAudio(checkbox.checked);
}

// Timer Controls
function toggleActionTimer() {
  const ctrlBtn = document.getElementById('timer-ctrl-btn');
  const langData = emergencyData[state.lang];
  
  if (timerIsRunning) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerIsRunning = false;
    if (ctrlBtn) ctrlBtn.innerText = langData.timerStart;
  } else {
    timerIsRunning = true;
    if (ctrlBtn) ctrlBtn.innerText = langData.timerPause;
    runTimerCountdown();
  }
}

function runTimerCountdown() {
  if (timerInterval) clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    if (timerSecondsLeft > 0) {
      timerSecondsLeft--;
      const display = document.getElementById('timer-display');
      if (display) {
        display.innerText = formatTime(timerSecondsLeft);
      }
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      timerIsRunning = false;
      
      // Play a completion double tick
      triggerCompletionTone();
      
      const ctrlBtn = document.getElementById('timer-ctrl-btn');
      const langData = emergencyData[state.lang];
      if (ctrlBtn) ctrlBtn.innerText = langData.timerStart;
    }
  }, 1000);
}

function resetActionTimer(initSeconds) {
  cleanupRhythmsAndTimers();
  timerSecondsLeft = initSeconds;
  
  const display = document.getElementById('timer-display');
  if (display) {
    display.innerText = formatTime(timerSecondsLeft);
  }
  
  const ctrlBtn = document.getElementById('timer-ctrl-btn');
  const langData = emergencyData[state.lang];
  if (ctrlBtn) ctrlBtn.innerText = langData.timerStart;
}

// Trigger timer finished indicator audio
function triggerCompletionTone() {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Play a dual-tone chord
    const now = audioCtx.currentTime;
    [523.25, 659.25].forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.7);
    });
  } catch(e) {}
}

// Formatting seconds -> MM:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Navigate step inside Action Room
function navigateActionStep(dir) {
  state.stepIndex += dir;
  cleanupRhythmsAndTimers();
  stopSpeaking();
  updateUrl();
  renderApp();
}

// Centralized SVG asset sprite dictionary
function getIconSvg(name, classes = "") {
  switch (name) {
    case 'bleeding':
      return `<svg class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>`;
    case 'choking':
      return `<svg class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>`;
    case 'burns':
      return `<svg class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>`;
    case 'heart_attack':
      return `<svg class="${classes}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`;
    default:
      return '';
  }
}

// Generate inline animated HTML vectors dynamically
function getAnimationSvg(type, rate = null, isGreen = false) {
  const duration = rate ? `${60 / rate}s` : '1s';
  const strokeColor = isGreen ? 'stroke-emerald-400' : 'stroke-rose-500';
  const fillColor = isGreen ? 'fill-emerald-500' : 'fill-rose-500';

  switch (type) {
    case 'pressure-pulse':
      return `
        <div class="relative w-44 h-44 flex items-center justify-center">
          <div class="absolute w-full h-full bg-red-600/10 rounded-full border border-red-500/35 anim-pressure-wave" style="--anim-duration: ${duration}"></div>
          <div class="absolute w-4/5 h-4/5 bg-red-600/15 rounded-full border border-red-500/20 anim-pressure-wave" style="--anim-duration: ${duration}; animation-delay: 0.2s"></div>
          <svg class="w-24 h-24 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.05 4.575a1 1 0 01.896-.007l5.5 3a1 1 0 01.55.897v5.07a1 1 0 01-.55.897l-5.5 3a1 1 0 01-.896-.007l-5.5-3A1 1 0 014 13.535V8.465a1 1 0 01.55-.897l5.5-3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 11.5v3M10.5 13h3" />
            <circle cx="12" cy="12" r="3" class="stroke-white" stroke-width="1.5" stroke-dasharray="2,2"/>
          </svg>
        </div>
      `;
      
    case 'elevation-pulse':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" class="text-rose-500 stroke-2 animate-bounce" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 14h-1.586a1 1 0 01-.707-.293l-3.414-3.414A1 1 0 0010.586 10H8" class="stroke-gray-400" />
          </svg>
        </div>
      `;

    case 'tourniquet-tighten':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <rect x="4" y="10" width="16" height="4" rx="2" class="fill-gray-600 stroke-gray-500" />
            <circle cx="12" cy="12" r="6" class="fill-rose-500/20 stroke-rose-500 stroke-2" />
            <line x1="8" y1="12" x2="16" y2="12" class="stroke-white stroke-2 anim-tourniquet" />
            <circle cx="8" cy="12" r="1.5" class="fill-white" />
            <circle cx="16" cy="12" r="1.5" class="fill-white" />
          </svg>
        </div>
      `;

    case 'wash-rinse':
      return `
        <div class="w-48 h-48 flex flex-col items-center justify-center relative">
          <svg class="w-20 h-20 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v13m0 0l-3-3m3 3l3-3M5 21h14" />
          </svg>
          <div class="absolute top-[80px] w-0.5 h-16 bg-gradient-to-b from-blue-400 to-transparent water-drop-1"></div>
          <div class="absolute top-[80px] w-0.5 h-16 bg-gradient-to-b from-blue-300 to-transparent water-drop-2 left-[45%]"></div>
          <div class="absolute top-[80px] w-0.5 h-16 bg-gradient-to-b from-blue-300 to-transparent water-drop-3 right-[45%]"></div>
          <div class="w-24 h-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 blur-sm mt-4"></div>
        </div>
      `;

    case 'eye-rinse':
      return `
        <div class="w-48 h-48 flex flex-col items-center justify-center relative">
          <svg class="w-24 h-24 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <div class="absolute top-10 right-10 w-0.5 h-20 bg-blue-300/80 water-drop-1 transform rotate-[45deg]"></div>
          <div class="absolute top-12 right-12 w-0.5 h-20 bg-blue-400/80 water-drop-2 transform rotate-[45deg]"></div>
        </div>
      `;

    case 'bandage-apply':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <div class="p-5 border border-white/5 bg-white/5 rounded-full anim-bandage">
            <svg class="w-20 h-20 ${strokeColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      `;

    case 'cough-encourage':
      return `
        <div class="w-48 h-48 flex items-center justify-center relative">
          <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span class="absolute top-[40px] left-[150px] w-6 h-6 border-2 border-red-500 rounded-full animate-ping"></span>
          <span class="absolute top-[35px] left-[140px] w-10 h-10 border border-coral/30 rounded-full animate-ping" style="animation-delay: 0.3s"></span>
        </div>
      `;

    case 'back-blows':
      return `
        <div class="w-48 h-48 flex items-center justify-center relative">
          <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-4-4m0 0l-4 4m4-4v12" class="stroke-rose-500 stroke-2 anim-thrust" style="--anim-duration: ${duration}"/>
            <circle cx="12" cy="7" r="4" />
            <path d="M6 14h6v8H6z" />
          </svg>
        </div>
      `;

    case 'heimlich-maneuver':
      return `
        <div class="w-48 h-48 flex items-center justify-center relative">
          <svg class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v12" class="stroke-rose-500 stroke-[3px] anim-thrust" style="--anim-duration: ${duration}"/>
            <path d="M12 4 C 15 4, 15 9, 12 9 C 9 9, 9 4, 12 4 Z" class="stroke-gray-300" />
            <path d="M8 12h8v10h-8z" class="fill-white/10" />
          </svg>
        </div>
      `;

    case 'call-emergency':
      return `
        <div class="w-44 h-44 flex items-center justify-center bg-red-600/10 rounded-full border border-red-500/20 pulse-crimson">
          <svg class="w-20 h-20 text-white anim-call-phone" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.157-5.143-3.476-6.3-6.3l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>
      `;

    case 'lay-flat':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <line x1="2" y1="18" x2="22" y2="18" class="stroke-gray-500 stroke-2" />
            <circle cx="18" cy="11" r="3.5" class="fill-white/15 stroke-white" />
            <rect x="4" y="145" width="10" height="3" class="fill-white" transform="translate(0, -131)"/>
            <path d="M6 15h8v3H6z" class="fill-white" />
            <path d="M12 17h1v-2h-1z" />
          </svg>
        </div>
      `;

    case 'cpr-compressions':
      return `
        <div class="w-48 h-48 flex flex-col items-center justify-center relative">
          <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4a4 4 0 100 8 4 4 0 000-8z" class="stroke-gray-400" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 19c0-2.761-2.686-5-6-5s-6 2.239-6 5" class="stroke-gray-300" />
            <g class="anim-cpr-chest" style="--anim-duration: ${duration}">
              <circle cx="12" cy="16.5" r="2.5" class="${fillColor} opacity-80" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 13.5h6v4H9z" class="fill-white/10 stroke-white stroke-2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11v5m0 0l-2-2m2 2l2-2" class="${strokeColor} stroke-2" />
            </g>
          </svg>
        </div>
      `;

    case 'rescue-breaths':
      return `
        <div class="w-48 h-48 flex items-center justify-center relative">
          <svg class="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <circle cx="12" cy="6" r="3" class="stroke-gray-400" />
            <path d="M7 10h10v12H7z" class="fill-white/5 stroke-gray-500" />
            <g class="anim-lungs">
              <path d="M9 12 C 9 17, 11 18, 11 13 C 11 18, 9 17, 9 12 Z" class="fill-emerald-400 stroke-emerald-500" />
              <path d="M15 12 C 15 17, 13 18, 13 13 C 13 18, 15 17, 15 12 Z" class="fill-emerald-400 stroke-emerald-500" />
            </g>
          </svg>
        </div>
      `;

    case 'recovery-position':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <line x1="2" y1="18" x2="22" y2="18" class="stroke-gray-500 stroke-2" />
            <ellipse cx="14" cy="11" rx="4" ry="2.5" class="fill-white/10 stroke-white" transform="rotate(-15, 14, 11)" />
            <path d="M5 16 C 8 13, 11 13, 13 16 Z" class="fill-white/20 stroke-gray-300" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 8a5 5 0 015 5" class="stroke-emerald-400 stroke-2 animate-pulse" />
          </svg>
        </div>
      `;

    case 'monitor-pulse':
      return `
        <div class="w-48 h-48 flex items-center justify-center relative">
          <svg class="w-36 h-36" viewBox="0 0 100 40" fill="none">
            <path d="M0,20 L30,20 L35,10 L40,30 L45,5 L50,25 L55,20 L100,20" class="stroke-emerald-400 stroke-2" stroke-dasharray="200" stroke-dashoffset="0">
              <animate attributeName="stroke-dashoffset" values="200;0" dur="2.5s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      `;

    case 'remove-jewelry':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M4 14 C 4 11, 7 10, 10 11 L18 11 C 19 11, 20 12, 20 13 C 20 14, 19 15, 18 15 L8 15" class="stroke-gray-400" />
            <g class="animate-bounce">
              <circle cx="15" cy="11" r="2.5" class="stroke-rose-400 stroke-[3px]" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 9l2-2" class="stroke-rose-400 stroke-2" />
            </g>
          </svg>
        </div>
      `;

    case 'remove-clothing':
      return `
        <div class="w-48 h-48 flex items-center justify-center">
          <svg class="w-28 h-28 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path d="M4 8 h8 v8 h-8 Z" class="fill-white/5 stroke-gray-400" />
            <g class="animate-pulse">
              <circle cx="14" cy="9" r="2" class="stroke-rose-500 stroke-2" />
              <circle cx="14" cy="15" r="2" class="stroke-rose-500 stroke-2" />
              <line x1="12" y1="10" x2="6" y2="13" class="stroke-rose-500 stroke-2" />
              <line x1="12" y1="14" x2="6" y2="11" class="stroke-rose-500 stroke-2" />
            </g>
          </svg>
        </div>
      `;

    default:
      return `
        <div class="w-44 h-44 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
          <svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      `;
  }
}

// Bind functions to global window namespace so that the inline HTML onclick handles work seamlessly
window.selectCase = selectCase;
window.selectDecision = selectDecision;
window.navigateBack = navigateBack;
window.navigateToHome = navigateToHome;
window.navigateActionStep = navigateActionStep;
window.toggleActionTimer = toggleActionTimer;
window.resetActionTimer = resetActionTimer;
window.toggleMetronomeAudioCheckbox = toggleMetronomeAudioCheckbox;
window.toggleVoiceGuidance = toggleVoiceGuidance;
window.speakStepContent = speakStepContent;
window.requestGpsPermission = requestGpsPermission;
