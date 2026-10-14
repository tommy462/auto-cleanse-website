import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ADBLUE_GUIDES } from '../data/adblue-guides';
import { TownDataContext, TOWNS_PATH } from './town-data';

const TOWN_PREFIX = '/adblue-repair/';
const STATIC_ADBLUE_PATHS = new Set([...ADBLUE_GUIDES.map((g) => g.path), '/adblue-repair-devon', TOWNS_PATH]);

// Whether the current page is a real page in the AdBlue section (guides, the
// Devon page, the areas index, published towns). Site-wide DPF messages (the
// chatbot, "same-day within 30 miles of Totnes") are swapped out on these.
// Only real pages count: an unknown /adblue-repair/<slug> is served the
// prerendered 404, so the footer, chatbot and sticky bar must render exactly as
// that HTML does or hydration fails. A town counts only when its data is on the
// page (server: the town store; browser: the inlined window.__ADBLUE_TOWN__).
export function useAdBluePage(): { isAdBlue: boolean; hasEnquiryForm: boolean } {
  const { pathname } = useLocation();
  const store = useContext(TownDataContext);
  const path = pathname.replace(/\/+$/, '') || '/';

  let isAdBlue = STATIC_ADBLUE_PATHS.has(path);
  if (!isAdBlue && path.startsWith(TOWN_PREFIX)) {
    const slug = path.slice(TOWN_PREFIX.length);
    isAdBlue = store
      ? Boolean(store.towns[slug])
      : typeof window !== 'undefined' && window.__ADBLUE_TOWN__?.slug === slug;
  }

  // Every AdBlue page except the areas index has <section id="enquiry">.
  return { isAdBlue, hasEnquiryForm: isAdBlue && path !== TOWNS_PATH };
}
