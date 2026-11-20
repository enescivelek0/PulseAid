// Centralized SVG asset sprite dictionary
export function getIconSvg(name, classes = "") {
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
export function getAnimationSvg(type, rate = null, isGreen = false) {
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
