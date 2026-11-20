'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from './AppProvider';
import { getCase, getLangData, getOption, isGreenZone, themeFor } from '@/lib/content';
import { getAnimationSvg } from '@/lib/visuals.js';
import { BackIcon, CheckIcon, ClockIcon, Markup, NextIcon, SpeakerIcon } from './Icons';

// ---------- audio helpers ----------
let audioCtx: AudioContext | null = null;
function getAudio() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}
function tone(freqs: number[], gain: number, dur: number) {
  const ctx = getAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  freqs.forEach((f) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(f, now);
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.start(now);
    o.stop(now + dur + 0.01);
  });
}

function speak(text: string, lang: 'tr' | 'en') {
  if (!('speechSynthesis' in window) || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'tr' ? 'tr-TR' : 'en-US';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith(lang));
  if (v) u.voice = v;
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
};

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// Persisted per-tab preferences
const prefs = { metronome: false, voice: false };

export function ActionView({ caseId, choice }: { caseId: string; choice: string }) {
  const { ready, lang, t, session, startSession, setChoice, goToStep, logEvent, finishSession } = useApp();
  const c = getCase(lang, caseId);
  const option = getOption(lang, caseId, choice);
  const langData = getLangData(lang);
  const th = themeFor(caseId);
  const green = isGreenZone(caseId, choice);

  // Ensure a matching session exists (deep links, quick CPR, refresh)
  useEffect(() => {
    if (!ready || !option) return;
    if (!session || session.caseId !== caseId || session.endedAt) startSession(caseId);
    setChoice(choice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, caseId, choice]);

  const matches = session && session.caseId === caseId && session.choice === choice;
  const finished = !!(matches && session!.endedAt);
  const steps = option?.steps ?? [];
  const stepIndex = matches ? Math.min(session!.stepIndex, steps.length - 1) : 0;
  const step = steps[stepIndex];

  const [metronomeOn, setMetronomeOn] = useState(prefs.metronome);
  const [voiceOn, setVoiceOn] = useState(prefs.voice);
  const [beat, setBeat] = useState(false);
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const metronomeRef = useRef(metronomeOn);
  metronomeRef.current = metronomeOn;

  // Reset timer when step changes
  useEffect(() => {
    setTimerRunning(false);
    setTimerLeft(step?.timer ?? 0);
  }, [caseId, choice, stepIndex, step?.timer]);

  // Metronome
  useEffect(() => {
    if (!step?.rate || finished) return;
    const id = setInterval(() => {
      setBeat(true);
      setTimeout(() => setBeat(false), 90);
      if (metronomeRef.current) tone([800], 0.25, 0.05);
    }, 60000 / step.rate);
    return () => clearInterval(id);
  }, [step?.rate, finished]);

  // Countdown
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => setTimerLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (timerRunning && timerLeft === 0) {
      setTimerRunning(false);
      tone([523.25, 659.25], 0.2, 0.6);
      navigator.vibrate?.([200, 100, 200]);
      logEvent('timerDone', stepIndex + 1);
    }
  }, [timerRunning, timerLeft, logEvent, stepIndex]);

  // Voice guidance on step / language change
  useEffect(() => {
    if (voiceOn && step && !finished) speak(step.text, lang);
  }, [voiceOn, step, lang, finished]);
  useEffect(() => () => stopSpeaking(), []);

  // Keep the screen on
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const req = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') lock = await navigator.wakeLock.request('screen');
      } catch {
        /* ignore */
      }
    };
    req();
    document.addEventListener('visibilitychange', req);
    return () => {
      document.removeEventListener('visibilitychange', req);
      lock?.release().catch(() => {});
    };
  }, []);

  const go = useCallback(
    (dir: number) => {
      const next = stepIndex + dir;
      if (next < 0 || next >= steps.length) return;
      stopSpeaking();
      goToStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [stepIndex, steps.length, goToStep]
  );

  // Keyboard shortcuts: ← / →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!c || !option || !step) return null;

  const isLast = stepIndex === steps.length - 1;
  const accent = green ? 'bg-emerald-500' : 'bg-crimson';

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto screen-transition text-center glass-panel rounded-[2rem] p-8 sm:p-12">
        <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-emerald-500 text-white pulse-green">
          <CheckIcon className="w-8 h-8" strokeWidth={3} />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-white">{t.finishTitle}</h1>
        <p className="mt-2 text-gray-300">{t.finishText}</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-navy font-extrabold hover:bg-gray-100 transition">
          {t.newCase}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto screen-transition">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <Link href={`/case/${caseId}`} className="glass-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white">
          <BackIcon className="w-4 h-4" /> {langData.backBtn}
        </Link>
        <div className="chip bg-white/5 border-white/10 text-gray-300 min-w-0">
          <span className={`truncate uppercase tracking-wider ${th.text}`}>{c.title}</span>
          <span className="text-gray-600">•</span>
          <span className="truncate text-coral">{option.label}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex gap-1.5 mb-5" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={stepIndex + 1}>
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToStep(i)}
            aria-label={`${t.step} ${i + 1}`}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? accent : 'bg-white/10 hover:bg-white/20'}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual */}
        <div className="order-2 lg:order-1 lg:col-span-5 relative glass-panel rounded-3xl p-2 sm:p-6 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] overflow-hidden">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${th.glow} to-transparent opacity-40`} />
          {step.rate && (
            <span className="absolute top-3 left-3 chip bg-black/30 border-white/10 text-gray-200">
              <span className={`w-2 h-2 rounded-full ${green ? 'bg-emerald-400' : 'bg-crimson'} ${beat ? 'scale-150' : ''} transition-transform`} />
              {step.rate} BPM
            </span>
          )}
          <Markup key={`${stepIndex}-${step.animation}`} html={getAnimationSvg(step.animation, step.rate ?? null, green)} className="relative" />
        </div>

        {/* Instruction */}
        <div className="order-1 lg:order-2 lg:col-span-7 glass-panel rounded-3xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest">
              {t.step} {stepIndex + 1} / {steps.length}
            </span>
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 pl-1 pr-2 py-1">
              <button
                type="button"
                onClick={() => speak(step.text, lang)}
                className="grid place-items-center w-7 h-7 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition"
                title={t.speak}
                aria-label={t.speak}
              >
                <SpeakerIcon className="w-4 h-4" />
              </button>
              <Toggle
                label={t.voice}
                checked={voiceOn}
                onChange={(v) => {
                  prefs.voice = v;
                  setVoiceOn(v);
                  if (!v) stopSpeaking();
                }}
              />
            </div>
          </div>

          <p key={`${lang}-${stepIndex}`} className="large-readable-text text-white flex-1 screen-transition" aria-live="polite">
            {step.text}
          </p>

          {step.timer && (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/5 text-gray-300 shrink-0">
                  <ClockIcon className="w-5 h-5" />
                </span>
                <span className="flex-1 text-3xl font-mono font-bold text-white tabular-nums" role="timer">{fmt(timerLeft)}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (timerRunning) return setTimerRunning(false);
                    if (timerLeft <= 0) setTimerLeft(step.timer!);
                    getAudio();
                    logEvent('timerStart', stepIndex + 1);
                    setTimerRunning(true);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                >
                  {timerRunning ? langData.timerPause : langData.timerStart}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerLeft(step.timer!);
                  }}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-300 bg-white/5 hover:bg-white/10 transition"
                >
                  {langData.timerReset}
                </button>
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${(1 - timerLeft / step.timer) * 100}%` }} />
              </div>
            </div>
          )}

          {step.rate && (
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-white/5 border border-white/10">
                <span className={`metro-circle w-5 h-5 rounded-full ${green ? 'bg-emerald-500/25' : 'bg-crimson/25'} ${beat ? (green ? 'flash-green' : 'flash') : ''}`} />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">{t.rhythm}</span>
                <span className="block text-sm font-bold font-mono text-white">{step.rate} BPM</span>
              </span>
              <span className="ml-auto">
                <Toggle
                  label={langData.metronomeToggle}
                  checked={metronomeOn}
                  onChange={(v) => {
                    prefs.metronome = v;
                    setMetronomeOn(v);
                    if (v) getAudio();
                  }}
                />
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => go(-1)}
                className="glass-btn flex-1 sm:flex-none px-5 py-3.5 rounded-2xl font-bold text-gray-200 hover:text-white active:scale-[0.98]"
              >
                {langData.prevBtn}
              </button>
            )}
            {isLast ? (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  finishSession();
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-white bg-emerald-500 hover:bg-emerald-600 pulse-green active:scale-[0.98] transition"
              >
                {langData.finishBtn} <CheckIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go(1)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-white active:scale-[0.98] transition ${
                  green ? 'bg-emerald-500 hover:bg-emerald-600 pulse-green' : 'bg-crimson hover:bg-crimson-dark pulse-crimson'
                }`}
              >
                {langData.nextBtn} <NextIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs sm:text-sm text-gray-500">{langData.distanceTip}</p>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer select-none">
      <span className="hidden sm:inline">{label}</span>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
        <span className="track" />
        <span className="dot" />
      </span>
    </label>
  );
}
