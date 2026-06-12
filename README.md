# PulseAid 🩸

**PulseAid** is a client-side, zero-friction, database-less progressive web application (PWA) designed for instant emergency first-aid visualization. 

Created with a corporate medical-tech color palette, high-contrast typography scaled for readability from a distance, and built-in offline synchronization, it serves as a companion in high-stress situations.

## Key Features

- **📍 GPS Locator Widget**: Instantly displays your latitude, longitude, and accuracy at the top of the header so you can read them to emergency dispatchers (112/911).
- **🔊 Text-To-Speech (TTS) Voice Guidance**: A voice assistant powered by the Web Speech API reads out instructions step-by-step so your eyes can stay focused on the patient.
- **📞 One-Tap Emergency Dialer**: Floating high-visibility red dialer button dynamically targets Turkish Emergency Service (`112`) or international standard (`911`) based on active language context.
- **🔊 Web Audio API Metronome**: Custom click generators sync visually and audibly to correct physical compression rates (e.g., 105 Compressions/Min for CPR) fully client-side without downloading external files.
- **⚡ Offline-First PWA Cache Policy**: Uses Service Workers to intercept, cache, and serve all local files (scripts, icons, markup) and remote modules (Tailwind CDN, Google Fonts) so the app loads instantly in remote areas without internet coverage.
- **🔄 URL State Synchronization**: All choices, active steps, and languages are synced dynamically to the query string (e.g. `?lang=tr&case=burns&choice=chemical&step=2`) for immediate bookmarking, deep-linking, or sharing.

## Tech Stack

- **Core**: Vanilla HTML5, ES6 Modules Javascript
- **Styles**: Custom CSS Keyframes, CSS variables, Glassmorphic styling, Tailwind CSS CDN
- **Bundler & Server**: Vite
- **PWA**: Native Service Worker API

## Local Development

Install packages:
```bash
npm install
```

Start the Vite local development server:
```bash
npm run dev
```

Build static bundle:
```bash
npm run build
```
