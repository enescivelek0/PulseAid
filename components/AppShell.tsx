'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useApp, formatClock, useNow } from './AppProvider';
import { SessionPanel } from './SessionPanel';
import { GeoChip } from './GeoChip';
import { CASE_IDS, getCase, themeFor } from '@/lib/content';
import { getIconSvg } from '@/lib/visuals.js';
import { ActivityIcon, GridIcon, Markup, PhoneIcon, XIcon } from './Icons';

export function AppShell({ children }: { children: ReactNode }) {
  const { lang, t, setLang, session, logEvent, online, sessionOpen, setSessionOpen } = useApp();
  const pathname = usePathname();
  const now = useNow(!!session && !session.endedAt);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close drawer on navigation
  useEffect(() => setSessionOpen(false), [pathname, setSessionOpen]);

  const elapsed = session ? (session.endedAt ?? now) - session.startedAt : 0;

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_21rem]">
      {/* ---------- Sidebar (desktop) ---------- */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-[100dvh] border-r border-white/[0.06] bg-navy-800/60 backdrop-blur-xl">
        <Brand tagline={t.appTagline} />
        <nav className="px-3 mt-2 flex-1 overflow-y-auto" aria-label={t.nav}>
          <NavItem href="/" active={pathname === '/'} icon={<GridIcon className="w-[18px] h-[18px]" />} label={t.dashboard} />
          <p className="px-3 mt-6 mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">{t.nav}</p>
          {CASE_IDS.map((id) => {
            const c = getCase(lang, id)!;
            const th = themeFor(id);
            const isActive = pathname?.startsWith(`/case/${id}`);
            const live = session?.caseId === id && !session.endedAt;
            return (
              <NavItem
                key={id}
                href={`/case/${id}`}
                active={!!isActive}
                icon={<Markup html={getIconSvg(c.icon, 'w-[18px] h-[18px]')} className={`grid place-items-center ${th.text}`} />}
                label={c.title}
                badge={live ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-crimson" /></span> : null}
              />
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/[0.06] space-y-3">
          <a
            href={`tel:${t.num}`}
            onClick={() => logEvent('call')}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-crimson hover:bg-crimson-dark text-white font-extrabold py-3 transition pulse-crimson"
          >
            <PhoneIcon className="w-5 h-5" /> {t.dial}
          </a>
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-neonGreen' : 'bg-amber-500 animate-pulse'}`} />
              {online ? t.online : t.offline}
            </span>
            <span>v3.0</span>
          </div>
        </div>
      </aside>

      {/* ---------- Main column ---------- */}
      <div className="min-w-0 flex flex-col min-h-[100dvh]">
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-navy/75 backdrop-blur-xl">
          <div className="h-14 px-4 sm:px-6 flex items-center gap-3">
            <div className="lg:hidden"><Brand compact tagline={t.appTagline} /></div>
            <div className="hidden lg:block text-sm text-gray-400 truncate">{t.appTagline}</div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:block"><GeoChip /></div>
              {mounted && session && (
                <button
                  type="button"
                  onClick={() => setSessionOpen(true)}
                  className="xl:hidden chip bg-crimson/15 border-crimson/30 text-white hover:bg-crimson/25 transition"
                >
                  <ActivityIcon className="w-3.5 h-3.5 text-crimson" />
                  <span className="font-mono tabular-nums">{formatClock(elapsed)}</span>
                </button>
              )}
              <div className="glass-panel p-1 rounded-full flex items-center" role="group" aria-label="Dil / Language">
                {(['tr', 'en'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wider transition ${lang === l ? 'bg-white text-navy' : 'text-gray-300 hover:text-white'}`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="sm:hidden px-4 pt-3 flex justify-center"><GeoChip /></div>

        <main id="main" className="flex-1 w-full px-4 sm:px-6 py-5 sm:py-8">{children}</main>

        <footer className="px-4 sm:px-6 pt-4 pb-28 lg:pb-6 text-xs text-gray-500 border-t border-white/[0.04]">
          {t.footer}
        </footer>
      </div>

      {/* ---------- Session panel (xl: column, below: drawer) ---------- */}
      <aside className="hidden xl:block sticky top-0 h-[100dvh] border-l border-white/[0.06] bg-navy-800/60 backdrop-blur-xl overflow-y-auto">
        <SessionPanel />
      </aside>

      {sessionOpen && (
        <div className="xl:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t.session}>
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSessionOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[min(24rem,100%)] bg-navy-800 border-l border-white/10 overflow-y-auto drawer-in">
            <button
              type="button"
              onClick={() => setSessionOpen(false)}
              className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <SessionPanel />
          </div>
        </div>
      )}

      {/* ---------- Floating call (mobile / tablet) ---------- */}
      <a
        href={`tel:${t.num}`}
        onClick={() => logEvent('call')}
        aria-label={t.dial}
        className="lg:hidden fixed z-40 bottom-4 right-4 flex items-center gap-2 bg-crimson hover:bg-crimson-dark text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-crimson/30 border border-white/20 active:scale-95 transition pulse-crimson"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <PhoneIcon className="w-5 h-5" />
        <span className="font-extrabold tracking-wide">{t.dial}</span>
      </a>
    </div>
  );
}

function Brand({ compact, tagline }: { compact?: boolean; tagline: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${compact ? '' : 'px-5 h-16 border-b border-white/[0.06]'}`} aria-label="PulseAid">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icon.svg" alt="" width={32} height={32} className="w-8 h-8 rounded-xl" />
      <span className="leading-none">
        <span className="block text-lg font-extrabold text-white tracking-tight">Pulse<span className="text-crimson">Aid</span></span>
        {!compact && <span className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mt-1">{tagline}</span>}
      </span>
    </Link>
  );
}

function NavItem({ href, active, icon, label, badge }: { href: string; active: boolean; icon: ReactNode; label: string; badge?: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
        active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="truncate flex-1">{label}</span>
      {badge}
    </Link>
  );
}
