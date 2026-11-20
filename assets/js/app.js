import { emergencyData } from './data.js';
import { getIconSvg, getAnimationSvg } from './visuals.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  lang: 'tr',
  caseId: null,
  choice: null,
  stepIndex: 0
};

// Timer
let timerInterval = null;
let timerSecondsLeft = 0;
let timerIsRunning = false;

// Metronome
let audioCtx = null;
let rhythmInterval = null;
let metronomeAudioEnabled = false;

// Voice
let speechEnabled = false;

// GPS
let gpsWatchId = null;
let gpsError = false;
let userLocation = null;

// Screen Wake Lock
let wakeLock = null;

const UI = {
  tr: {
    footer: 'PulseAid bir rehberdir; profesyonel tıbbi yardımın yerini tutmaz. Acil durumda hemen 112\'yi arayın.',
    online: 'Çevrimiçi • Çevrimdışı kullanıma hazır',
    offline: 'Çevrimdışı çalışıyor',
    step: 'Adım',
    speak: 'Seslendir',
    voice: 'Sesli asistan',
    rhythm: 'Ritim',
    gpsWait: 'Konumu göster',
    gpsDenied: 'Konum izni yok',
    gpsCopy: 'Koordinatları kopyala',
    copied: 'Kopyalandı ✓',
    dial: '112 ACİL ARA',
    num: '112',
    categories: 'Acil durum kategorileri',
    docTitle: 'PulseAid – Dijital İlk Yardım Rehberi'
  },
  en: {
    footer: 'PulseAid is a guide and does not replace professional medical care. In an emergency, call your local emergency number now.',
    online: 'Online • Ready for offline use',
    offline: 'Running offline',
    step: 'Step',
    speak: 'Read aloud',
    voice: 'Voice assistant',
    rhythm: 'Rhythm',
    gpsWait: 'Show location',
    gpsDenied: 'Location blocked',
    gpsCopy: 'Copy coordinates',
    copied: 'Copied ✓',
    dial: 'CALL 911',
    num: '911',
    categories: 'Emergency categories',
    docTitle: 'PulseAid – Digital First Aid Guide'
  }
};

const ICONS = {
  back: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>',
  next: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
  check: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.4" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
  chevron: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
  speaker: '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>',
  clock: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  pin: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>'
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
function init() {
  parseUrlParams();

  window.addEventListener('popstate', () => {
    resetSession();
    parseUrlParams();
    renderApp();
  });

  document.getElementById('lang-tr').addEventListener('click', () => setLanguage('tr'));
  document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
  document.getElementById('brand-link').addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHome();
  });

  // Event delegation for everything rendered inside the app container
  document.getElementById('app-container').addEventListener('click', onAppClick);
  document.getElementById('app-container').addEventListener('change', onAppChange);

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.choice) requestWakeLock();
  });

  // Only start GPS automatically if permission was granted earlier (no surprise prompt)
  if (navigator.permissions?.query) {
    navigator.permissions.query({ name: 'geolocation' })
      .then((res) => { if (res.state === 'granted') initGpsTracking(); })
      .catch(() => {});
  }

  registerServiceWorker();
  renderApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('SW registration failed:', err));
  });
}

// ---------------------------------------------------------------------------
// Routing / URL state
// ---------------------------------------------------------------------------
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);

  const lang = params.get('lang');
  state.lang = lang === 'en' ? 'en' : 'tr';

  const cases = emergencyData[state.lang].cases;
  const caseId = params.get('case');
  state.caseId = caseId && has(cases, caseId) ? caseId : null;

  const choice = params.get('choice');
  state.choice = state.caseId && choice && has(cases[state.caseId].options, choice) ? choice : null;

  const step = parseInt(params.get('step'), 10);
  const maxStep = state.choice ? cases[state.caseId].options[state.choice].steps.length - 1 : 0;
  state.stepIndex = Number.isNaN(step) ? 0 : Math.min(Math.max(step, 0), maxStep);
}

function updateUrl(replace = false) {
  const params = new URLSearchParams();
  params.set('lang', state.lang);
  if (state.caseId) params.set('case', state.caseId);
  if (state.choice) params.set('choice', state.choice);
  if (state.stepIndex > 0) params.set('step', state.stepIndex);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  if (newUrl === window.location.pathname + window.location.search) return;
  window.history[replace ? 'replaceState' : 'pushState'](null, '', newUrl);
}

function setLanguage(lang) {
  if (state.lang === lang) return;
  state.lang = lang;
  stopSpeaking();
  updateUrl(true);
  renderApp({ keepTimer: true });
}

function navigateToHome() {
  state.caseId = null;
  state.choice = null;
  state.stepIndex = 0;
  resetSession();
  updateUrl();
  renderApp();
}

function navigateBack() {
  resetSession();
  if (state.stepIndex > 0) state.stepIndex--;
  else if (state.choice) state.choice = null;
  else state.caseId = null;
  updateUrl();
  renderApp();
}

function selectCase(caseId) {
  if (!has(emergencyData[state.lang].cases, caseId)) return;
  state.caseId = caseId;
  state.choice = null;
  state.stepIndex = 0;
  updateUrl();
  renderApp();
}

function selectDecision(choiceKey) {
  state.choice = choiceKey;
  state.stepIndex = 0;
  resetSession();
  updateUrl();
  renderApp();
}

function navigateActionStep(dir) {
  const steps = emergencyData[state.lang].cases[state.caseId].options[state.choice].steps;
  const next = state.stepIndex + dir;
  if (next < 0 || next >= steps.length) return;
  state.stepIndex = next;
  resetSession();
  updateUrl();
  renderApp();
}

// ---------------------------------------------------------------------------
// Event delegation
// ---------------------------------------------------------------------------
function onAppClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const { action, value } = el.dataset;
  switch (action) {
    case 'case': selectCase(value); break;
    case 'decision': selectDecision(value); break;
    case 'back': navigateBack(); break;
    case 'home': navigateToHome(); break;
    case 'step': navigateActionStep(Number(value)); break;
    case 'timer-toggle': toggleActionTimer(); break;
    case 'timer-reset': resetActionTimer(Number(value)); break;
    case 'speak': speakStepContent(); break;
    default: break;
  }
}

function onAppChange(e) {
  if (e.target.id === 'metronome-audio-toggle') toggleMetronomeAudio(e.target.checked);
  if (e.target.id === 'voice-assistant-toggle') toggleVoiceGuidance(e.target.checked);
}

// ---------------------------------------------------------------------------
// Timers / metronome / audio
// ---------------------------------------------------------------------------
function stopRhythm() {
  if (rhythmInterval) {
    clearInterval(rhythmInterval);
    rhythmInterval = null;
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerIsRunning = false;
}

// Full reset when leaving a step
function resetSession() {
  stopRhythm();
  stopTimer();
  timerSecondsLeft = 0;
  stopSpeaking();
}

function getAudioCtx() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch (e) {
    return null;
  }
}

function playTone(freqs, gain, duration) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  });
}

function triggerVisualTick(isGreen) {
  const flashClass = isGreen ? 'flash-green' : 'flash';
  document.querySelectorAll('.metro-circle').forEach((dot) => {
    dot.classList.add(flashClass);
    setTimeout(() => dot.classList.remove(flashClass), 90);
  });
}

function setupMetronome(bpm, isGreen) {
  stopRhythm();
  if (!bpm) return;
  rhythmInterval = setInterval(() => {
    triggerVisualTick(isGreen);
    if (metronomeAudioEnabled) playTone([800], 0.25, 0.05);
  }, 60000 / bpm);
}

function toggleMetronomeAudio(enabled) {
  metronomeAudioEnabled = enabled;
  if (enabled) getAudioCtx(); // unlock audio on user gesture
}

function toggleActionTimer() {
  const step = currentStep();
  if (!step || !step.timer) return;

  if (timerIsRunning) {
    stopTimer();
  } else {
    if (timerSecondsLeft <= 0) timerSecondsLeft = step.timer;
    timerIsRunning = true;
    getAudioCtx();
    runTimerCountdown();
  }
  updateTimerUi();
}

function runTimerCountdown() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timerSecondsLeft > 0) timerSecondsLeft--;
    if (timerSecondsLeft <= 0) {
      stopTimer();
      playTone([523.25, 659.25], 0.2, 0.6);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    updateTimerUi();
  }, 1000);
}

function resetActionTimer(initSeconds) {
  stopTimer();
  timerSecondsLeft = initSeconds;
  updateTimerUi();
}

function updateTimerUi() {
  const langData = emergencyData[state.lang];
  const display = document.getElementById('timer-display');
  const btn = document.getElementById('timer-ctrl-btn');
  const bar = document.getElementById('timer-bar');
  const step = currentStep();
  if (display) display.textContent = formatTime(timerSecondsLeft);
  if (btn) btn.textContent = timerIsRunning ? langData.timerPause : langData.timerStart;
  if (bar && step?.timer) bar.style.width = `${(1 - timerSecondsLeft / step.timer) * 100}%`;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Speech
// ---------------------------------------------------------------------------
function speakText(text) {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = state.lang === 'tr' ? 'tr-TR' : 'en-US';
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith(state.lang));
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function speakStepContent() {
  speakText(document.getElementById('instruction-text')?.textContent.trim());
}

function toggleVoiceGuidance(enabled) {
  speechEnabled = enabled;
  if (enabled) speakStepContent();
  else stopSpeaking();
}

// ---------------------------------------------------------------------------
// Wake lock / online status
// ---------------------------------------------------------------------------
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    }
  } catch (e) { /* unsupported or denied */ }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}

function updateOnlineStatus() {
  const ui = UI[state.lang];
  const dot = document.getElementById('offline-dot');
  const text = document.getElementById('offline-status');
  if (!dot || !text) return;
  const online = navigator.onLine;
  dot.className = `w-2 h-2 rounded-full ${online ? 'bg-neonGreen' : 'bg-amber-500 animate-pulse'}`;
  text.textContent = online ? ui.online : ui.offline;
}

// ---------------------------------------------------------------------------
// GPS
// ---------------------------------------------------------------------------
function initGpsTracking() {
  if (!navigator.geolocation || gpsWatchId !== null) return;
  gpsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      userLocation = {
        lat: pos.coords.latitude.toFixed(5),
        lng: pos.coords.longitude.toFixed(5),
        accuracy: Math.round(pos.coords.accuracy)
      };
      gpsError = false;
      updateGpsDisplay();
    },
    (err) => {
      console.warn('GPS error:', err.message);
      gpsError = err.code === err.PERMISSION_DENIED;
      if (gpsError || !userLocation) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;
      }
      updateGpsDisplay();
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
}

function updateGpsDisplay() {
  const ui = UI[state.lang];
  const html = userLocation
    ? `<button type="button" data-gps="copy" title="${ui.gpsCopy}" aria-label="${ui.gpsCopy}"
         class="chip max-w-full bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 transition">
         <span class="relative flex h-1.5 w-1.5 shrink-0"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span></span>
         <span class="gps-text truncate font-mono tracking-tight">${userLocation.lat}, ${userLocation.lng} <span class="opacity-60">±${userLocation.accuracy}m</span></span>
       </button>`
    : `<button type="button" data-gps="request"
         class="chip bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition">
         ${ICONS.pin}<span>${gpsError ? ui.gpsDenied : ui.gpsWait}</span>
       </button>`;

  ['gps-indicator', 'gps-indicator-mobile'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = html;
    const btn = el.querySelector('[data-gps]');
    btn.addEventListener('click', btn.dataset.gps === 'copy' ? copyCoordinates : initGpsTracking);
  });
}

function copyCoordinates(e) {
  if (!userLocation || !navigator.clipboard) return;
  const span = e.currentTarget.querySelector('.gps-text');
  navigator.clipboard.writeText(`${userLocation.lat}, ${userLocation.lng}`).then(() => {
    span.textContent = UI[state.lang].copied;
    setTimeout(updateGpsDisplay, 1400);
  }).catch(() => {});
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
function currentStep() {
  const c = emergencyData[state.lang].cases[state.caseId];
  return c?.options[state.choice]?.steps[state.stepIndex] || null;
}

function renderShell() {
  const ui = UI[state.lang];
  document.documentElement.lang = state.lang;

  const active = ['bg-white', 'text-navy'];
  const inactive = ['text-gray-300', 'hover:text-white'];
  ['tr', 'en'].forEach((l) => {
    const btn = document.getElementById(`lang-${l}`);
    btn.classList.remove(...active, ...inactive);
    btn.classList.add(...(l === state.lang ? active : inactive));
    btn.setAttribute('aria-pressed', String(l === state.lang));
  });

  const dialer = document.getElementById('emergency-dialer');
  dialer.href = `tel:${ui.num}`;
  dialer.setAttribute('aria-label', ui.dial);
  document.getElementById('emergency-dialer-label').textContent = ui.dial;
  document.getElementById('footer-text').textContent = ui.footer;

  updateOnlineStatus();
  updateGpsDisplay();
}

function renderApp({ keepTimer = false } = {}) {
  const langData = emergencyData[state.lang];
  renderShell();

  if (!keepTimer) resetSession();
  else stopRhythm();

  const container = document.getElementById('app-container');
  const selectedCase = state.caseId ? langData.cases[state.caseId] : null;
  const selectedOption = selectedCase && state.choice ? selectedCase.options[state.choice] : null;

  let html;
  if (!selectedCase) {
    html = selectorScreen(langData);
    document.title = UI[state.lang].docTitle;
  } else if (!selectedOption) {
    html = decisionScreen(selectedCase, langData);
    document.title = `${selectedCase.title} · PulseAid`;
  } else {
    html = actionRoomScreen(selectedCase, selectedOption, langData);
    document.title = `${selectedCase.title} · PulseAid`;
  }

  container.innerHTML = `<div class="w-full screen-transition">${html}</div>`;

  if (selectedOption) {
    afterActionRoomRender(selectedCase);
    requestWakeLock();
  } else {
    releaseWakeLock();
  }

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function backButton(label) {
  return `
    <button type="button" data-action="back" class="glass-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white">
      ${ICONS.back}<span>${label}</span>
    </button>`;
}

// Screen 1 — category selector
function selectorScreen(langData) {
  const cards = Object.entries(langData.cases).map(([key, c]) => `
    <button type="button" data-action="case" data-value="${key}" id="card-${key}"
      class="glass-card group w-full text-left rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:flex-col sm:items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson">
      <span class="shrink-0 grid place-items-center w-14 h-14 rounded-2xl bg-crimson/10 border border-crimson/25 group-hover:bg-crimson/20 transition">
        ${getIconSvg(c.icon, 'w-8 h-8 text-crimson')}
      </span>
      <span class="min-w-0 flex-1">
        <span class="flex items-center justify-between gap-2">
          <span class="block text-lg sm:text-xl font-extrabold text-white leading-tight">${c.title}</span>
          <span class="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition sm:hidden">${ICONS.chevron}</span>
        </span>
        <span class="block mt-1 text-sm text-gray-400 leading-snug line-clamp-2">${c.description}</span>
      </span>
    </button>`).join('');

  return `
    <section class="text-center mb-6 sm:mb-8">
      <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">${langData.title}</h1>
      <p class="mt-2 sm:mt-3 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">${langData.subtitle}</p>
    </section>
    <nav aria-label="${UI[state.lang].categories}" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-6">
      ${cards}
    </nav>
    <p class="max-w-3xl mx-auto text-center text-xs sm:text-sm text-gray-400 flex items-start sm:items-center justify-center gap-2">
      <span class="mt-1 sm:mt-0 inline-block w-2 h-2 rounded-full bg-neonGreen shrink-0"></span>
      <span>${langData.distanceTip}</span>
    </p>`;
}

// Screen 2 — decision question
function decisionScreen(selectedCase, langData) {
  const options = Object.entries(selectedCase.options).map(([key, o], i) => `
    <button type="button" data-action="decision" data-value="${key}"
      class="w-full rounded-2xl px-5 py-4 sm:py-5 text-lg sm:text-xl font-extrabold text-white border transition active:scale-[0.98]
      ${i === 0 ? 'bg-crimson/90 hover:bg-crimson border-crimson shadow-lg shadow-crimson/20' : 'glass-btn hover:border-white/30'}">
      ${o.label}
    </button>`).join('');

  return `
    <div class="max-w-2xl mx-auto">
      <div class="mb-4">${backButton(langData.backBtn)}</div>
      <div class="glass-panel rounded-3xl p-5 sm:p-8 text-center shadow-2xl">
        <div class="inline-flex items-center gap-2 mb-4 chip bg-crimson/10 border-crimson/25 text-crimson uppercase tracking-wider">
          ${getIconSvg(selectedCase.icon, 'w-4 h-4')}<span>${selectedCase.title}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-snug mb-6 sm:mb-8">${selectedCase.question}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${options}</div>
      </div>
    </div>`;
}

// Screen 3 — action room
function actionRoomScreen(selectedCase, selectedOption, langData) {
  const ui = UI[state.lang];
  const steps = selectedOption.steps;
  const step = steps[state.stepIndex];
  const bpm = step.rate || null;
  const hasTimer = typeof step.timer === 'number';
  const isGreen = isGreenZone(selectedCase);
  const isLast = state.stepIndex === steps.length - 1;
  const accent = isGreen ? 'bg-emerald-500' : 'bg-crimson';

  if (hasTimer && timerSecondsLeft <= 0 && !timerIsRunning) timerSecondsLeft = step.timer;

  const progress = steps.map((_, i) => `
    <span class="h-1.5 flex-1 rounded-full ${i <= state.stepIndex ? accent : 'bg-white/10'} transition-colors"></span>`).join('');

  const timerHtml = hasTimer ? `
    <div class="w-full rounded-2xl bg-white/5 border border-white/10 p-3">
      <div class="flex items-center gap-3">
        <span class="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-gray-300 shrink-0">${ICONS.clock}</span>
        <span id="timer-display" class="flex-1 text-3xl font-mono font-bold text-white tabular-nums" role="timer" aria-live="off">${formatTime(timerSecondsLeft)}</span>
        <button type="button" data-action="timer-toggle" id="timer-ctrl-btn" class="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition">
          ${timerIsRunning ? langData.timerPause : langData.timerStart}
        </button>
        <button type="button" data-action="timer-reset" data-value="${step.timer}" class="px-3 py-2 rounded-xl text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition">
          ${langData.timerReset}
        </button>
      </div>
      <div class="mt-3 h-1 rounded-full bg-white/10 overflow-hidden"><div id="timer-bar" class="h-full bg-emerald-400 transition-all duration-1000" style="width:${(1 - timerSecondsLeft / step.timer) * 100}%"></div></div>
    </div>` : '';

  const rhythmHtml = bpm ? `
    <div class="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5">
      <span class="grid place-items-center w-9 h-9 rounded-full bg-white/5 border border-white/10">
        <span class="metro-circle w-5 h-5 rounded-full ${isGreen ? 'bg-emerald-500/25' : 'bg-crimson/25'}"></span>
      </span>
      <span class="leading-tight">
        <span class="block text-[11px] font-bold uppercase tracking-wider text-gray-400">${ui.rhythm}</span>
        <span class="block text-sm font-bold font-mono text-white">${bpm} BPM</span>
      </span>
      <label class="ml-auto flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer select-none">
        <span class="hidden sm:inline">${langData.metronomeToggle}</span>
        <span class="sm:hidden">🔊</span>
        <span class="switch">
          <input type="checkbox" id="metronome-audio-toggle" ${metronomeAudioEnabled ? 'checked' : ''} aria-label="${langData.metronomeToggle}">
          <span class="track"></span><span class="dot"></span>
        </span>
      </label>
    </div>` : '';

  const nextBtn = isLast
    ? `<button type="button" data-action="home" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 pulse-green active:scale-[0.98] transition">
         <span>${langData.finishBtn}</span>${ICONS.check}
       </button>`
    : `<button type="button" data-action="step" data-value="1" class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-white active:scale-[0.98] transition
         ${isGreen ? 'bg-emerald-500 hover:bg-emerald-600 pulse-green' : 'bg-crimson hover:bg-crimson-dark pulse-crimson'}">
         <span>${langData.nextBtn}</span>${ICONS.next}
       </button>`;

  const prevBtn = state.stepIndex > 0
    ? `<button type="button" data-action="step" data-value="-1" class="glass-btn flex-1 sm:flex-none px-5 py-3.5 rounded-2xl font-bold text-gray-200 hover:text-white active:scale-[0.98]">
         ${langData.prevBtn}
       </button>` : '';

  return `
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        ${backButton(langData.backBtn)}
        <div class="chip bg-white/5 border-white/10 text-gray-300 min-w-0">
          <span class="truncate uppercase tracking-wider">${selectedCase.title}</span>
          <span class="text-gray-500">•</span>
          <span class="truncate text-coral">${selectedOption.label}</span>
        </div>
      </div>

      <div class="flex gap-1.5 mb-4" aria-hidden="true">${progress}</div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div class="lg:col-span-5 glass-panel rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[280px] shadow-2xl">
          ${getAnimationSvg(step.animation, bpm, isGreen)}
        </div>

        <div class="lg:col-span-7 glass-panel rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-2xl">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">${ui.step} ${state.stepIndex + 1} / ${steps.length}</span>
            <div class="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 pl-1 pr-2 py-1">
              <button type="button" data-action="speak" class="grid place-items-center w-7 h-7 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition" title="${ui.speak}" aria-label="${ui.speak}">
                ${ICONS.speaker}
              </button>
              <label class="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer select-none">
                <span>${ui.voice}</span>
                <span class="switch">
                  <input type="checkbox" id="voice-assistant-toggle" ${speechEnabled ? 'checked' : ''} aria-label="${ui.voice}">
                  <span class="track"></span><span class="dot"></span>
                </span>
              </label>
            </div>
          </div>

          <p id="instruction-text" class="large-readable-text text-white flex-1">${step.text}</p>

          ${timerHtml}
          ${rhythmHtml}

          <div class="flex gap-3 pt-1">${prevBtn}${nextBtn}</div>
        </div>
      </div>

      <p class="mt-4 text-center text-xs sm:text-sm text-gray-400">${langData.distanceTip}</p>
    </div>`;
}

function isGreenZone(selectedCase) {
  return selectedCase.icon === 'burns' || (selectedCase.icon === 'bleeding' && state.choice === 'oozing');
}

function afterActionRoomRender(selectedCase) {
  const step = currentStep();
  if (!step) return;
  if (step.rate) setupMetronome(step.rate, isGreenZone(selectedCase));
  if (step.timer && timerIsRunning) runTimerCountdown();
  if (speechEnabled) speakText(step.text);
}
