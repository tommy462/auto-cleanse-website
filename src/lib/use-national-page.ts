import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ADBLUE_GUIDES } from '../data/adblue-guides';
import { TownDataContext, TOWNS_PATH } from './town-data';
import { RemapTownDataContext, REMAP_TOWNS_PATH } from './remap-town-data';

const TOWN_PREFIX = '/adblue-repair/';
const REMAP_TOWN_PREFIX = '/ecu-remapping/';
const STATIC_ADBLUE_PATHS = new Set([...ADBLUE_GUIDES.map((g) => g.path), '/adblue-repair-devon', TOWNS_PATH]);

// Whether the current page is a real page in a national section: the AdBlue
// guides, the Devon AdBlue page, the AdBlue and remap areas indexes and the
// published AdBlue and remap towns. Site-wide DPF messages (the chatbot,
// "same-day within 30 miles of Totnes") are swapped out on these.
// Only real pages count: an unknown /adblue-repair/<slug> or
// /ecu-remapping/<slug> is served the prerendered 404, so the footer, chatbot
// and sticky bar must render exactly as that HTML does or hydration fails. A
// town counts only when its data is on the page (server: the town store;
// browser: the inlined window.__ADBLUE_TOWN__ or window.__REMAP_TOWN__).
export function useNationalPage(): { isNational: boolean; hasEnquiryForm: boolean } {
  const { pathname } = useLocation();
  const store = useContext(TownDataContext);
  const remapStore = useContext(RemapTownDataContext);
  const path = pathname.replace(/\/+$/, '') || '/';

  let isNational = STATIC_ADBLUE_PATHS.has(path) || path === REMAP_TOWNS_PATH;
  if (!isNational && path.startsWith(TOWN_PREFIX)) {
    const slug = path.slice(TOWN_PREFIX.length);
    isNational = store
      ? Boolean(store.towns[slug])
      : typeof window !== 'undefined' && window.__ADBLUE_TOWN__?.slug === slug;
  } else if (!isNational && path.startsWith(REMAP_TOWN_PREFIX)) {
    const slug = path.slice(REMAP_TOWN_PREFIX.length);
    isNational = remapStore
      ? Boolean(remapStore.towns[slug])
      : typeof window !== 'undefined' && window.__REMAP_TOWN__?.slug === slug;
  }

  // Every national page except the two areas indexes has <section id="enquiry">.
  return { isNational, hasEnquiryForm: isNational && path !== TOWNS_PATH && path !== REMAP_TOWNS_PATH };
}
