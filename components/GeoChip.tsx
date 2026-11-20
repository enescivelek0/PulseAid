'use client';

import { useState } from 'react';
import { useApp } from './AppProvider';
import { PinIcon } from './Icons';

export function GeoChip() {
  const { geo, requestGeo, t } = useApp();
  const [copied, setCopied] = useState(false);

  if (geo.status === 'ok') {
    const coords = `${geo.lat}, ${geo.lng}`;
    return (
      <button
        type="button"
        title={t.gpsCopy}
        onClick={() =>
          navigator.clipboard?.writeText(coords).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
        }
        className="chip max-w-full bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 transition"
      >
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="truncate font-mono tracking-tight">
          {copied ? t.copied : <>{coords} <span className="opacity-60">±{geo.accuracy}m</span></>}
        </span>
      </button>
    );
  }

  const label = geo.status === 'locating' ? t.gpsLocating : geo.status === 'denied' ? t.gpsDenied : t.gpsWait;
  return (
    <button
      type="button"
      onClick={requestGeo}
      className="chip bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition"
    >
      <PinIcon className={`w-3.5 h-3.5 ${geo.status === 'locating' ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </button>
  );
}
