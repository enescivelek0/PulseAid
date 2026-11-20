'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '@/lib/content';
import { UI, type UIStrings } from '@/lib/i18n';

export type EventKey = keyof (typeof UI)['tr']['ev'];

export interface SessionEvent {
  t: number;
  key: EventKey;
  /** raw detail: step number, option key, etc. */
  detail?: string | number;
}

export interface Session {
  caseId: string;
  choice: string | null;
  startedAt: number;
  endedAt: number | null;
  stepIndex: number;
  completed: number[];
  events: SessionEvent[];
}

export interface GeoState {
  status: 'idle' | 'locating' | 'ok' | 'denied' | 'error';
  lat?: string;
  lng?: string;
  accuracy?: number;
}

interface Ctx {
  ready: boolean;
  lang: Lang;
  t: UIStrings;
  setLang: (l: Lang) => void;
  session: Session | null;
  startSession: (caseId: string) => void;
  setChoice: (choice: string) => void;
  goToStep: (index: number) => void;
  logEvent: (key: EventKey, detail?: string | number) => void;
  finishSession: () => void;
  endSession: () => void;
  geo: GeoState;
  requestGeo: () => void;
  online: boolean;
  sessionOpen: boolean;
  setSessionOpen: (v: boolean) => void;
}

const AppContext = createContext<Ctx | null>(null);

const LS_LANG = 'pulseaid.lang';
const LS_SESSION = 'pulseaid.session';

function readLS<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function writeLS(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('tr');
  const [session, setSession] = useState<Session | null>(null);
  const [geo, setGeo] = useState<GeoState>({ status: 'idle' });
  const [online, setOnline] = useState(true);
  const [sessionOpen, setSessionOpen] = useState(false);
  const watchId = useRef<number | null>(null);
  const hydrated = useRef(false);
  const [ready, setReady] = useState(false);

  // Hydrate from storage / URL once on the client
  useEffect(() => {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const stored = readLS<Lang>(LS_LANG);
    const initial: Lang = urlLang === 'en' || urlLang === 'tr' ? urlLang : stored === 'en' ? 'en' : 'tr';
    setLangState(initial);
    const s = readLS<Session>(LS_SESSION);
    if (s && Date.now() - s.startedAt < 1000 * 60 * 60 * 12) setSession(s);
    setOnline(navigator.onLine);
    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (hydrated.current) writeLS(LS_LANG, lang);
  }, [lang]);

  useEffect(() => {
    if (hydrated.current) writeLS(LS_SESSION, session);
  }, [session]);

  // Online / offline
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  // Service worker (production only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const requestGeo = useCallback(() => {
    if (!navigator.geolocation || watchId.current !== null) return;
    setGeo((g) => (g.status === 'ok' ? g : { status: 'locating' }));
    watchId.current = navigator.geolocation.watchPosition(
      (pos) =>
        setGeo({
          status: 'ok',
          lat: pos.coords.latitude.toFixed(5),
          lng: pos.coords.longitude.toFixed(5),
          accuracy: Math.round(pos.coords.accuracy),
        }),
      (err) => {
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
        setGeo((g) => (g.status === 'ok' ? g : { status: err.code === err.PERMISSION_DENIED ? 'denied' : 'error' }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // Auto-start GPS only if permission was granted before (no surprise prompt)
  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'geolocation' as PermissionName })
      .then((r) => r.state === 'granted' && requestGeo())
      .catch(() => {});
  }, [requestGeo]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const push = (s: Session, key: EventKey, detail?: string | number): Session => ({
    ...s,
    events: [...s.events, { t: Date.now(), key, detail }],
  });

  const startSession = useCallback((caseId: string) => {
    setSession((prev) => {
      if (prev && prev.caseId === caseId && !prev.endedAt) return prev;
      const s: Session = { caseId, choice: null, startedAt: Date.now(), endedAt: null, stepIndex: 0, completed: [], events: [] };
      return push(s, 'start', caseId);
    });
  }, []);

  const setChoice = useCallback((choice: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      if (prev.choice === choice) return prev;
      return push({ ...prev, choice, stepIndex: 0, completed: [] }, 'choice', choice);
    });
  }, []);

  const goToStep = useCallback((index: number) => {
    setSession((prev) => {
      if (!prev || prev.stepIndex === index) return prev;
      const completed = index > prev.stepIndex ? Array.from(new Set([...prev.completed, prev.stepIndex])) : prev.completed;
      return push({ ...prev, stepIndex: index, completed }, 'step', index + 1);
    });
  }, []);

  const logEvent = useCallback((key: EventKey, detail?: string | number) => {
    setSession((prev) => (prev ? push(prev, key, detail) : prev));
  }, []);

  const finishSession = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.endedAt) return prev;
      return push({ ...prev, endedAt: Date.now(), completed: Array.from(new Set([...prev.completed, prev.stepIndex])) }, 'finish');
    });
  }, []);

  const endSession = useCallback(() => setSession(null), []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      lang,
      t: UI[lang],
      setLang,
      session,
      startSession,
      setChoice,
      goToStep,
      logEvent,
      finishSession,
      endSession,
      geo,
      requestGeo,
      online,
      sessionOpen,
      setSessionOpen,
    }),
    [ready, lang, setLang, session, startSession, setChoice, goToStep, logEvent, finishSession, endSession, geo, requestGeo, online, sessionOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useNow(active = true, interval = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [active, interval]);
  return now;
}
