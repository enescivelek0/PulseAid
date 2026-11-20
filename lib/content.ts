import { emergencyData } from './data.js';

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

const data = emergencyData as unknown as Record<Lang, LangData>;

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
};

export const themeFor = (caseId: string) => CASE_THEME[caseId] ?? CASE_THEME.bleeding;
