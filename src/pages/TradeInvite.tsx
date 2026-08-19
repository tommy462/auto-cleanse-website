import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import {
  getTradeInviteRegion,
  type TradeInviteRegion,
} from '../data/trade-invite-regions';
import { useCampaignParams, trackTradeEvent } from '../lib/trade-campaign';
import {
  PrivateInvitationBanner,
  TradeInviteHero,
  FreeOfferCard,
} from '../components/trade-invite/TradeInviteHero';
import {
  IncludedProcess,
  TurnaroundGuarantee,
  WhyFree,
  PartnershipSteps,
  TradeTrust,
  DirectContact,
  FinalTradeCta,
} from '../components/trade-invite/TradeInviteSections';
import { TurnaroundTerms, OfferTerms } from '../components/trade-invite/TradeTerms';
import FreeDpfClaimForm from '../components/trade-invite/FreeDpfClaimForm';
import StickyMobileCta from '../components/trade-invite/StickyMobileCta';

/**
 * Private regional trade-outreach landing page. One template drives every
 * /trade-invite/<slug> route from src/data/trade-invite-regions.ts.
 *
 * These pages are noindex + nofollow, excluded from the XML sitemap and never
 * linked from the navigation, footer or any public service page. They still load
 * normally when opened directly (QR code) and analytics is unaffected.
 */
export default function TradeInvite() {
  const { region: slug } = useParams<{ region: string }>();
  const region = getTradeInviteRegion(slug);

  // Unknown regional slug → render the real 404 page (which carries noindex).
  // On the server these routes are never prerendered, so Vercel serves the
  // static 404.html with a genuine HTTP 404.
  if (!region) return <NotFound />;

  return <TradeInvitePage region={region} />;
}

function TradeInvitePage({ region }: { region: TradeInviteRegion }) {
  const campaign = useCampaignParams(region);
  const viewedRef = useRef(false);

  // Fire the page-view event once, after the UTM parameters have been captured.
  useEffect(() => {
    if (viewedRef.current) return;
    if (!campaign.landingUrl) return;
    viewedRef.current = true;
    trackTradeEvent('trade_invite_view', region, campaign);
  }, [region, campaign]);

  const props = { region, campaign };

  return (
    <div className="bg-[#0A0A0A]">
      <SEO
        title={region.metaTitle}
        description={region.metaDescription}
        path={`/trade-invite/${region.slug}`}
        noindex
        nofollow
        selfCanonical
      />

      <PrivateInvitationBanner />
      <TradeInviteHero {...props} />
      <FreeOfferCard {...props} />
      <IncludedProcess {...props} />
      <TurnaroundGuarantee {...props} />
      <WhyFree />
      <PartnershipSteps />
      <TradeTrust />
      <FreeDpfClaimForm {...props} />
      <DirectContact {...props} />
      <FinalTradeCta {...props} />
      <TurnaroundTerms />
      <OfferTerms {...props} />
      <StickyMobileCta {...props} />
    </div>
  );
}
