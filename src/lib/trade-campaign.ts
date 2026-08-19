// Campaign attribution + GA4 events for the private trade-outreach landing pages.
//
// UTM parameters arrive on the printed QR URL, e.g.
//   /trade-invite/exeter?utm_source=postal-letter&utm_medium=qr
//     &utm_campaign=trade-outreach-exeter&utm_content=batch-01
//
// They are captured on first render and mirrored into sessionStorage so they
// survive a reload or an in-page navigation and are still available when the
// claim form is submitted.
//
// Analytics reuses the site's existing GA4/gtag setup via trackEvent, so no second
// analytics script is loaded.
import { useEffect, useState } from 'react';
import { trackEvent } from './tracking';
import type { TradeInviteRegion } from '../data/trade-invite-regions';

export interface CampaignParams {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  referrer: string;
  landingUrl: string;
}

const EMPTY: CampaignParams = {
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmContent: '',
  referrer: '',
  landingUrl: '',
};

const storageKey = (slug: string) => `ac_trade_campaign_${slug}`;

/**
 * Reads UTM params from the current URL, falling back to anything previously
 * stored for this region. Safe to call during SSR (returns EMPTY).
 */
export function captureCampaignParams(region: TradeInviteRegion): CampaignParams {
  if (typeof window === 'undefined') return EMPTY;

  const search = new URLSearchParams(window.location.search);
  const fromUrl: Partial<CampaignParams> = {
    utmSource: search.get('utm_source') ?? '',
    utmMedium: search.get('utm_medium') ?? '',
    utmCampaign: search.get('utm_campaign') ?? '',
    utmContent: search.get('utm_content') ?? '',
  };

  let stored: Partial<CampaignParams> = {};
  try {
    const raw = window.sessionStorage.getItem(storageKey(region.slug));
    if (raw) stored = JSON.parse(raw) as Partial<CampaignParams>;
  } catch {
    /* sessionStorage unavailable (private mode), fall back to URL only */
  }

  const merged: CampaignParams = {
    // A value on the URL always wins; otherwise reuse what we stored earlier.
    utmSource: fromUrl.utmSource || stored.utmSource || '',
    utmMedium: fromUrl.utmMedium || stored.utmMedium || '',
    // Default the campaign to the region's own identifier so leads are always
    // attributable even if the QR code was typed in by hand.
    utmCampaign: fromUrl.utmCampaign || stored.utmCampaign || region.campaignId,
    utmContent: fromUrl.utmContent || stored.utmContent || '',
    referrer: stored.referrer || document.referrer || '',
    landingUrl: stored.landingUrl || window.location.href,
  };

  try {
    window.sessionStorage.setItem(storageKey(region.slug), JSON.stringify(merged));
  } catch {
    /* ignore write failures */
  }

  return merged;
}

/** React hook wrapper. Returns EMPTY during SSR, real values after mount. */
export function useCampaignParams(region: TradeInviteRegion): CampaignParams {
  const [params, setParams] = useState<CampaignParams>(EMPTY);

  useEffect(() => {
    setParams(captureCampaignParams(region));
  }, [region]);

  return params;
}

/**
 * Fires a GA4 event with the campaign context attached to every hit.
 * Event names used by these pages:
 *   trade_invite_view, free_dpf_cta_click, trade_phone_click,
 *   trade_whatsapp_click, free_dpf_form_start, free_dpf_form_submit,
 *   free_dpf_form_error, turnaround_terms_view, offer_terms_view
 */
export function trackTradeEvent(
  name: string,
  region: TradeInviteRegion,
  params: CampaignParams,
  extra: Record<string, unknown> = {}
): void {
  trackEvent(name, {
    region: region.regionName,
    region_slug: region.slug,
    invitation_code: region.invitationCode,
    campaign_id: region.campaignId,
    utm_content: params.utmContent,
    utm_source: params.utmSource,
    utm_medium: params.utmMedium,
    page_path: typeof window !== 'undefined' ? window.location.pathname : `/trade-invite/${region.slug}`,
    ...extra,
  });
}
