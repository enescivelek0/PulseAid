import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  viewBox: '0 0 24 24',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export const PhoneIcon = (p: P) => (
  <svg {...base(p)}><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.157-5.143-3.476-6.3-6.3l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
);
export const BackIcon = (p: P) => (<svg {...base(p)}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>);
export const NextIcon = (p: P) => (<svg {...base(p)}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>);
export const CheckIcon = (p: P) => (<svg {...base(p)}><path d="M5 13l4 4L19 7" /></svg>);
export const ChevronIcon = (p: P) => (<svg {...base(p)}><path d="M9 5l7 7-7 7" /></svg>);
export const SpeakerIcon = (p: P) => (
  <svg {...base(p)}><path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
);
export const ClockIcon = (p: P) => (<svg {...base(p)}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
export const PinIcon = (p: P) => (
  <svg {...base(p)}><path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
);
export const GridIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
);
export const ClipboardIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
);
export const ShareIcon = (p: P) => (
  <svg {...base(p)}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
);
export const XIcon = (p: P) => (<svg {...base(p)}><path d="M6 18L18 6M6 6l12 12" /></svg>);
export const ActivityIcon = (p: P) => (<svg {...base(p)}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>);

/** Renders one of the legacy SVG markup strings from lib/visuals.js */
export function Markup({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
