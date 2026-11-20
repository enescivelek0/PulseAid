'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, formatClock, useNow } from './AppProvider';
import { CASE_IDS, getCase, getLangData, themeFor } from '@/lib/content';
import { getIconSvg } from '@/lib/visuals.js';
import { ActivityIcon, ChevronIcon, Markup, PhoneIcon } from './Icons';

export function HomeView() {
  const { lang, t, session, startSession, setChoice, logEvent } = useApp();
  const router = useRouter();
  const langData = getLangData(lang);
  const live = session && !session.endedAt ? session : null;
  const now = useNow(!!live);

  const quickCpr = () => {
    startSession('heart_attack');
    setChoice('not_breathing');
    router.push('/case/heart_attack/not_breathing');
  };

  return (
    <div className="max-w-5xl mx-auto screen-transition">
      {/* Live session banner */}
      {live && (
        <Link
          href={live.choice ? `/case/${live.caseId}/${live.choice}` : `/case/${live.caseId}`}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-crimson/30 bg-crimson/10 hover:bg-crimson/15 px-4 py-3 transition"
        >
          <ActivityIcon className="w-5 h-5 text-crimson shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-white truncate">{getCase(lang, live.caseId)?.title}</span>
            <span className="block text-xs text-gray-400">{t.active} · {formatClock(now - live.startedAt)}</span>
          </span>
          <span className="text-sm font-bold text-white shrink-0">{t.resume} →</span>
        </Link>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.01] px-5 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-crimson/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <span className="chip bg-emerald-500/10 border-emerald-500/25 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.badge}
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              {t.h1a}
              <br />
              <span className="bg-gradient-to-r from-crimson via-coral to-amber-200 bg-clip-text text-transparent">{t.h1b}</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl">{t.lead}</p>
          </div>

          <div className="flex flex-col gap-3 lg:w-72">
            <a
              href={`tel:${t.num}`}
              onClick={() => logEvent('call')}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-crimson hover:bg-crimson-dark text-white font-extrabold text-lg shadow-xl shadow-crimson/30 active:scale-[0.98] transition"
            >
              <PhoneIcon className="w-5 h-5" /> {t.call}
            </a>
            <button
              type="button"
              onClick={quickCpr}
              className="inline-flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-white text-navy hover:bg-gray-100 active:scale-[0.98] transition"
            >
              <span className="flex items-center gap-2 font-extrabold text-lg">❤️ {t.cpr}</span>
              <span className="text-xs font-semibold text-gray-500">{t.cprHint}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">{t.pick}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {CASE_IDS.map((id, i) => {
            const c = langData.cases[id];
            const th = themeFor(id);
            const opts = Object.values(c.options);
            const stepCount = opts.reduce((n, o) => n + o.steps.length, 0);
            return (
              <Link
                key={id}
                href={`/case/${id}`}
                onClick={() => startSession(id)}
                className="group relative overflow-hidden flex flex-col rounded-3xl p-5 sm:p-6 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 transition duration-300"
              >
                <span className={`pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${th.glow} to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition`} />
                <span className="relative flex items-start gap-4">
                  <Markup
                    html={getIconSvg(c.icon, 'w-8 h-8 sm:w-9 sm:h-9')}
                    className={`shrink-0 grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ring-1 ${th.ring} ${th.tile} group-hover:scale-105 transition`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-gray-500 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span className="block text-lg sm:text-2xl font-extrabold text-white leading-tight">{c.title}</span>
                    <span className="block mt-1.5 text-sm sm:text-base text-gray-400 leading-snug">{c.description}</span>
                  </span>
                </span>
                <span className="relative mt-auto pt-5 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${th.dot}`} />
                    {opts.length} {t.scenarios} · {stepCount} {t.steps}
                  </span>
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-300 group-hover:bg-white group-hover:text-navy transition">
                    <ChevronIcon className="w-5 h-5" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-8 glass-panel rounded-3xl p-5 sm:p-6">
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {t.how.map(([title, desc], i) => (
            <li key={title} className="flex items-start gap-3">
              <span className="shrink-0 grid place-items-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-sm font-extrabold text-white">{i + 1}</span>
              <span>
                <span className="block font-bold text-white text-sm">{title}</span>
                <span className="block text-xs sm:text-sm text-gray-400">{desc}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 pt-4 border-t border-white/5 text-xs sm:text-sm text-gray-400 flex items-start gap-2">
          <span className="mt-1 inline-block w-2 h-2 rounded-full bg-neonGreen shrink-0" />
          <span>{langData.distanceTip}</span>
        </p>
      </section>
    </div>
  );
}
