import type { AdBlueGuide } from './types';
import hub from './hub';
import p20ee from './p20ee';
import p20e8 from './p20e8';
import p204f from './p204f';
import noxSensor from './nox-sensor';
import stellantisTank from './stellantis-tank';
import countdownNoStart from './countdown-no-start';
import warningLight from './warning-light';
import deleteLaw from './delete-law';
import howWeQuote from './how-we-quote';

export const ADBLUE_HUB_PATH = '/adblue-repair';

// Order sets the order of the hub's guide list.
export const ADBLUE_GUIDES: AdBlueGuide[] = [
  hub,
  countdownNoStart,
  warningLight,
  p20ee,
  p20e8,
  p204f,
  noxSensor,
  stellantisTank,
  deleteLaw,
  howWeQuote,
];

const OTHER_PAGE_LABELS: Record<string, string> = {
  '/adblue-repair-devon': 'AdBlue repair in Devon',
  '/ecu-remapping': 'ECU remapping',
  '/contact': 'Contact us',
  '/dpf-diagnostics-devon': 'DPF fault diagnostics',
  '/blog/how-adblue-and-scr-systems-work': 'How AdBlue and SCR systems work',
  '/blog/nox-sensor-faults-on-scr-systems': 'NOx sensor faults on SCR systems',
  '/blog/adblue-crystallisation-and-dosing-faults': 'AdBlue crystallisation and dosing faults',
};

export function getAdBlueGuideByPath(path: string): AdBlueGuide | undefined {
  return ADBLUE_GUIDES.find((g) => g.path === path);
}

export function guideLabel(path: string): string {
  return getAdBlueGuideByPath(path)?.breadcrumb ?? OTHER_PAGE_LABELS[path] ?? path;
}