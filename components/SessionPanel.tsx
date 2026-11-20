'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp, formatClock, useNow, type Session } from './AppProvider';
import { getCase, getOption, themeFor, type Lang } from '@/lib/content';
import { UI } from '@/lib/i18n';
import { getIconSvg } from '@/lib/visuals.js';
import { CheckIcon, ClipboardIcon, Markup, ShareIcon } from './Icons';

function clock(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function eventText(lang: Lang, s: Session, key: string, detail?: string | number) {
  const t = UI[lang];
  const label = t.ev[key as keyof typeof t.ev] ?? key;
  if (key === 'start') return `${label}: ${getCase(lang, String(detail))?.title ?? ''}`;
  if (key === 'choice') return `${label}: ${getOption(lang, s.caseId, String(detail))?.label ?? ''}`;
  if (key === 'step' || key === 'timerStart' || key === 'timerDone') return detail ? `${label} (${t.step} ${detail})` : label;
  return label;
}

export function buildReport(lang: Lang, s: Session, geo: { lat?: string; lng?: string }) {
  const t = UI[lang];
  const c = getCase(lang, s.caseId);
  const o = s.choice ? getOption(lang, s.caseId, s.choice) : null;
  const lines = [
    t.reportTitle,
    `${new Date(s.startedAt).toLocaleString()}`,
    `${c?.title ?? ''}${o ? ' — ' + o.label : ''}`,
    `${t.elapsed}: ${formatClock((s.endedAt ?? Date.now()) - s.startedAt)}`,
  ];
  if (geo.lat) lines.push(`${t.location}: ${geo.lat}, ${geo.lng} (https://maps.google.com/?q=${geo.lat},${geo.lng})`);
  lines.push('', `${t.log}:`);
  s.events.forEach((e) => lines.push(`${clock(e.t)}  ${eventText(lang, s, e.key, e.detail)}`));
  return lines.join('\n');
}

export function SessionPanel() {
  const { session, lang, t, geo, endSession, logEvent } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const now = useNow(!!session && !session.endedAt);
  const [copied, setCopied] = useState(false);

  if (!session) {
    return (
      <div className="p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.session}</h2>
        <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center">
          <div className="mx-auto mb-3 grid place-items-center w-12 h-12 rounded-2xl bg-white/5 text-gray-500">
            <ClipboardIcon className="w-6 h-6" />
          </div>
          <p className="font-bold text-gray-200">{t.noSession}</p>
          <p className="mt-1 text-sm text-gray-500">{t.noSessionHint}</p>
        </div>
      </div>
    );
  }

  const c = getCase(lang, session.caseId);
  const option = session.choice ? getOption(lang, session.caseId, session.choice) : null;
  const steps = option?.steps ?? [];
  const th = themeFor(session.caseId);
  const elapsed = (session.endedAt ?? now) - session.startedAt;
  const doneCount = session.endedAt ? steps.length : session.completed.length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const href = session.choice ? `/case/${session.caseId}/${session.choice}` : `/case/${session.caseId}`;

  const report = () => buildReport(lang, session, geo);
  const copy = () =>
    navigator.clipboard?.writeText(report()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  const share = () => {
    if (navigator.share) navigator.share({ title: t.reportTitle, text: report() }).catch(() => {});
    else copy();
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t.session}</h2>
        <span className={`chip ${session.endedAt ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-crimson/15 border-crimson/30 text-white'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${session.endedAt ? 'bg-emerald-400' : 'bg-crimson animate-pulse'}`} />
          {session.endedAt ? t.completed : t.active}
        </span>
      </div>

      {/* Case card */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-4">
        <div className="flex items-center gap-3">
          <Markup html={getIconSvg(c?.icon ?? '', 'w-6 h-6')} className={`grid place-items-center w-11 h-11 rounded-xl ${th.tile}`} />
          <div className="min-w-0">
            <p className="font-extrabold text-white leading-tight truncate">{c?.title}</p>
            {option && <p className="text-xs text-coral truncate">{option.label}</p>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t.elapsed}</p>
            <p className="mt-0.5 text-2xl font-mono font-bold text-white tabular-nums">{formatClock(elapsed)}</p>
          </div>
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{t.progress}</p>
            <p className="mt-0.5 text-2xl font-mono font-bold text-white tabular-nums">{pct}%</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className={`h-full ${th.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        {!session.endedAt && pathname !== href && (
          <Link href={href} className="mt-3 block text-center text-sm font-bold rounded-xl py-2 bg-white/5 hover:bg-white/10 text-white transition">
            {t.resume} →
          </Link>
        )}
      </div>

      {/* Checklist */}
      {steps.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t.checklist}</h3>
          <ol className="space-y-1.5">
            {steps.map((st, i) => {
              const done = session.endedAt != null || session.completed.includes(i);
              const current = !session.endedAt && session.stepIndex === i;
              return (
                <li
                  key={i}
                  className={`flex gap-3 rounded-xl p-2.5 text-sm ${current ? 'bg-white/[0.07] ring-1 ring-white/15' : ''}`}
                >
                  <span
                    className={`shrink-0 grid place-items-center w-6 h-6 rounded-full text-[11px] font-extrabold ${
                      done ? 'bg-emerald-500 text-white' : current ? `${th.dot} text-white` : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {done ? <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={`line-clamp-2 ${done ? 'text-gray-500' : current ? 'text-white' : 'text-gray-400'}`}>{st.text}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Event log */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t.log}</h3>
        <ol className="relative border-l border-white/10 ml-1.5 space-y-3 max-h-64 overflow-y-auto pr-1">
          {[...session.events].reverse().map((e, i) => (
            <li key={`${e.t}-${i}`} className="pl-4 relative">
              <span className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-navy-800 ${i === 0 ? th.dot : 'bg-gray-600'}`} />
              <p className="text-[11px] font-mono text-gray-500">{clock(e.t)}</p>
              <p className="text-sm text-gray-200 leading-snug">{eventText(lang, session, e.key, e.detail)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={copy} className="glass-btn inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-gray-200">
          <ClipboardIcon className="w-4 h-4" /> {copied ? t.copied : t.copyReport}
        </button>
        <button type="button" onClick={share} className="glass-btn inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-gray-200">
          <ShareIcon className="w-4 h-4" /> {t.shareReport}
        </button>
        <button
          type="button"
          onClick={() => {
            logEvent('ended');
            endSession();
            router.push('/');
          }}
          className="col-span-2 rounded-xl py-2.5 text-sm font-bold text-gray-400 hover:text-white border border-white/10 hover:border-white/25 transition"
        >
          {t.endSession}
        </button>
      </div>
    </div>
  );
}
