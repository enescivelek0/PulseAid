import { emergencyData } from './data.js';
import { extraCases } from './data-extra.js';

export type Lang = 'tr' | 'en';

export interface Step {
  text: string;
  animation: string;
  rate?: number;
  timer?: number;
}
export interface CaseOption {
  label: string;
  steps: Step[];
}
export interface EmergencyCase {
  title: string;
  icon: string;
  description: string;
  question: string;
  options: Record<string, CaseOption>;
}
export interface LangData {
  title: string;
  subtitle: string;
  backBtn: string;
  nextBtn: string;
  prevBtn: string;
  finishBtn: string;
  metronomeToggle: string;
  timerReset: string;
  timerStart: string;
  timerPause: string;
  activeRhythm: string;
  distanceTip: string;
  cases: Record<string, EmergencyCase>;
}

const base = emergencyData as unknown as Record<Lang, LangData>;
const extra = extraCases as unknown as Record<Lang, Record<string, EmergencyCase>>;

// Order: life-threatening first, then the rest
const ORDER = ['heart_attack', 'choking', 'bleeding', 'stroke', 'allergy', 'seizure', 'poisoning', 'burns', 'heatstroke', 'fracture'];

function merge(lang: Lang): LangData {
  const all = { ...base[lang].cases, ...extra[lang] };
  const cases: Record<string, EmergencyCase> = {};
  ORDER.forEach((id) => { if (all[id]) cases[id] = all[id]; });
  Object.keys(all).forEach((id) => { if (!cases[id]) cases[id] = all[id]; });
  return { ...base[lang], cases };
}

const data: Record<Lang, LangData> = { tr: merge('tr'), en: merge('en') };

export const CASE_IDS = Object.keys(data.tr.cases);

export function getLangData(lang: Lang): LangData {
  return data[lang];
}

export function getCase(lang: Lang, caseId: string): EmergencyCase | null {
  return Object.prototype.hasOwnProperty.call(data[lang].cases, caseId) ? data[lang].cases[caseId] : null;
}

export function getOption(lang: Lang, caseId: string, choice: string): CaseOption | null {
  const c = getCase(lang, caseId);
  return c && Object.prototype.hasOwnProperty.call(c.options, choice) ? c.options[choice] : null;
}

export function isGreenZone(caseId: string, choice?: string | null) {
  return caseId === 'burns' || (caseId === 'bleeding' && choice === 'oozing');
}

export const CASE_THEME: Record<string, { tile: string; glow: string; dot: string; text: string; ring: string }> = {
  bleeding: { tile: 'bg-rose-500/15 text-rose-400', glow: 'from-rose-500/30', dot: 'bg-rose-500', text: 'text-rose-400', ring: 'ring-rose-500/30' },
  choking: { tile: 'bg-amber-500/15 text-amber-300', glow: 'from-amber-500/30', dot: 'bg-amber-400', text: 'text-amber-300', ring: 'ring-amber-500/30' },
  burns: { tile: 'bg-orange-500/15 text-orange-400', glow: 'from-orange-500/30', dot: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/30' },
  heart_attack: { tile: 'bg-fuchsia-500/15 text-fuchsia-300', glow: 'from-fuchsia-500/30', dot: 'bg-fuchsia-500', text: 'text-fuchsia-300', ring: 'ring-fuchsia-500/30' },
  stroke: { tile: 'bg-sky-500/15 text-sky-300', glow: 'from-sky-500/30', dot: 'bg-sky-500', text: 'text-sky-300', ring: 'ring-sky-500/30' },
  seizure: { tile: 'bg-violet-500/15 text-violet-300', glow: 'from-violet-500/30', dot: 'bg-violet-500', text: 'text-violet-300', ring: 'ring-violet-500/30' },
  allergy: { tile: 'bg-pink-500/15 text-pink-300', glow: 'from-pink-500/30', dot: 'bg-pink-500', text: 'text-pink-300', ring: 'ring-pink-500/30' },
  fracture: { tile: 'bg-teal-500/15 text-teal-300', glow: 'from-teal-500/30', dot: 'bg-teal-500', text: 'text-teal-300', ring: 'ring-teal-500/30' },
  poisoning: { tile: 'bg-lime-500/15 text-lime-300', glow: 'from-lime-500/30', dot: 'bg-lime-500', text: 'text-lime-300', ring: 'ring-lime-500/30' },
  heatstroke: { tile: 'bg-yellow-500/15 text-yellow-300', glow: 'from-yellow-500/30', dot: 'bg-yellow-400', text: 'text-yellow-300', ring: 'ring-yellow-500/30' },
};

export const themeFor = (caseId: string) => CASE_THEME[caseId] ?? CASE_THEME.bleeding;
