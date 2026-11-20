'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useApp } from './AppProvider';
import { getCase, getLangData, themeFor } from '@/lib/content';
import { getIconSvg } from '@/lib/visuals.js';
import { BackIcon, ChevronIcon, Markup } from './Icons';

export function DecisionView({ caseId }: { caseId: string }) {
  const { ready, lang, t, startSession, setChoice } = useApp();
  const c = getCase(lang, caseId);
  const langData = getLangData(lang);
  const th = themeFor(caseId);

  // Opening a case directly (deep link / sidebar) starts its session
  useEffect(() => {
    if (ready && c) startSession(caseId);
  }, [ready, c, caseId, startSession]);

  if (!c) return null;

  return (
    <div className="max-w-3xl mx-auto screen-transition">
      <Link href="/" className="glass-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white mb-5">
        <BackIcon className="w-4 h-4" /> {langData.backBtn}
      </Link>

      <div className="relative overflow-hidden glass-panel rounded-[2rem] p-5 sm:p-10 shadow-2xl">
        <div className={`pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${th.glow} to-transparent blur-3xl`} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <Markup html={getIconSvg(c.icon, 'w-6 h-6')} className={`grid place-items-center w-11 h-11 rounded-xl ring-1 ${th.ring} ${th.tile}`} />
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${th.text}`}>{c.title}</p>
              <p className="text-xs text-gray-500">{t.question}</p>
            </div>
          </div>

          <h1 className="mt-6 text-2xl sm:text-4xl font-extrabold text-white leading-tight">{c.question}</h1>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(c.options).map(([key, o], i) => (
              <Link
                key={key}
                href={`/case/${caseId}/${key}`}
                onClick={() => setChoice(key)}
                className={`group flex items-center justify-between gap-3 rounded-2xl px-5 py-5 text-lg sm:text-xl font-extrabold text-white border transition active:scale-[0.98] ${
                  i === 0 ? 'bg-crimson/90 hover:bg-crimson border-crimson shadow-lg shadow-crimson/20' : 'glass-btn hover:border-white/30'
                }`}
              >
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-widest opacity-70">{o.steps.length} {t.steps}</span>
                  {o.label}
                </span>
                <ChevronIcon className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
