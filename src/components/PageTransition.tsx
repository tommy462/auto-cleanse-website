import { useEffect, useRef } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';

// Import all pages here
import Home from '../pages/Home';
import Services from '../pages/Services';
import Pricing from '../pages/Pricing';
import HowItWorks from '../pages/HowItWorks';
import WhyClean from '../pages/WhyClean';
import Maintenance from '../pages/Maintenance';
import About from '../pages/About';
import Contact from '../pages/Contact';
import PostalDPF from '../pages/PostalDPF';
import DPFCleaningHub from '../pages/DPFCleaningHub';
import DPFCleaningTotnes from '../pages/DPFCleaningTotnes';
import DPFCleaningDevon from '../pages/DPFCleaningDevon';
import DPFCleaningExeter from '../pages/DPFCleaningExeter';
import DPFCleaningPlymouth from '../pages/DPFCleaningPlymouth';
import DPFCleaningTorquay from '../pages/DPFCleaningTorquay';
import DPFCleaningPaignton from '../pages/DPFCleaningPaignton';
import DPFCleaningNewtonAbbot from '../pages/DPFCleaningNewtonAbbot';
import DPFDiagnosticsDevon from '../pages/DPFDiagnosticsDevon';
import BlockedDPFCleaningDevon from '../pages/BlockedDPFCleaningDevon';
import AdBlueRepairDevon from '../pages/AdBlueRepairDevon';
import BlogIndex from '../pages/BlogIndex';
import BlogPost from '../pages/BlogPost';
import RemappingBooking from '../pages/RemappingBooking';
import EcuRemappingHub from '../pages/EcuRemappingHub';
import RemappingLocationsHub from '../pages/RemappingLocationsHub';
import DynamicPage from '../pages/DynamicPage';
import BookingSuccess from '../pages/BookingSuccess';
import BookingCancel from '../pages/BookingCancel';
import VehiclePerformanceLookup from '../pages/VehiclePerformanceLookup';
import DiagnosticMatcher from '../pages/DiagnosticMatcher';
import DVLADiagnostic from '../pages/DVLADiagnostic';
import BookNow from '../pages/BookNow';
import EcuCloning from '../pages/EcuCloning';
import TradeFileService from '../pages/TradeFileService';
import DPFCleaningNearMe from '../pages/DPFCleaningNearMe';
import TradeInvite from '../pages/TradeInvite';
import Privacy from '../pages/Privacy';
import CookiePolicy from '../pages/CookiePolicy';
import Terms from '../pages/Terms';
import RefundPolicy from '../pages/RefundPolicy';
import ReviewsPage from '../pages/ReviewsPage';
import NotFound from '../pages/NotFound';
import AdBlueGuide from '../pages/AdBlueGuide';
import AdBlueTown from '../pages/AdBlueTown';
import AdBlueAreas from '../pages/AdBlueAreas';
import RemapTown from '../pages/RemapTown';
import RemapAreas from '../pages/RemapAreas';
import { ADBLUE_GUIDES } from '../data/adblue-guides';

export default function PageTransition() {
    const location = useLocation();
    // The entrance animation must only run for client-side navigations, never on
    // the first render. On initial load the prerendered content has to be visible
    // immediately (no opacity/blur wrapper) so the largest hero text can paint
    // without waiting for the JS bundle to hydrate - this is the main LCP fix.
    // A ref (not state) avoids a re-render that would flash the animation on load.
    // It keys off the pathname, so an in-page jump such as #enquiry (which
    // changes the location but not the page) doesn't replay the animation.
    const initialPath = useRef(location.pathname);
    const hasNavigated = useRef(false);
    if (location.pathname !== initialPath.current) hasNavigated.current = true;

    useEffect(() => {
        // Top out scroll when route changes, unless the link targets a section on the new
        // page (e.g. the home page's link to /dpf-cleaning#dpf-simulator).
        const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
        if (target) target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
        else window.scrollTo(0, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <div
            key={location.pathname}
            className={`w-full h-full${hasNavigated.current ? ' page-enter' : ''}`}
        >
            <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/why-clean" element={<WhyClean />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/postal-dpf" element={<PostalDPF />} />
                    <Route path="/dpf-cleaning" element={<DPFCleaningHub />} />
                    <Route path="/dpf-cleaning-near-me" element={<DPFCleaningNearMe />} />
                    <Route path="/dpf-cleaning-totnes" element={<DPFCleaningTotnes />} />
                    <Route path="/dpf-cleaning-devon" element={<DPFCleaningDevon />} />
                    
                    {/* ECU Remapping Architecture */}
                    <Route path="/ecu-remapping" element={<EcuRemappingHub />} />
                    <Route path="/ecu-remapping-locations" element={<RemappingLocationsHub />} />
                    <Route path="/vehicle-performance-lookup" element={<VehiclePerformanceLookup />} />
                    <Route path="/diagnostic-matcher" element={<DiagnosticMatcher />} />
                    
                    {/* Redirect old routes */}
                    <Route path="/remapping" element={<Navigate to="/ecu-remapping" replace />} />
                    <Route path="/remapping-devon" element={<Navigate to="/ecu-remapping" replace />} />
                    <Route path="/vehicle-remapping" element={<Navigate to="/vehicle-performance-lookup" replace />} />
                    
                    <Route path="/remapping-booking" element={<RemappingBooking />} />
                    <Route path="/book" element={<BookNow />} />
                    <Route path="/ecu-cloning" element={<EcuCloning />} />
                    <Route path="/trade-file-service" element={<TradeFileService />} />

                    <Route path="/dpf-cleaning-exeter" element={<DPFCleaningExeter />} />
                    <Route path="/dpf-cleaning-plymouth" element={<DPFCleaningPlymouth />} />
                    <Route path="/dpf-cleaning-torquay" element={<DPFCleaningTorquay />} />
                    <Route path="/dpf-cleaning-paignton" element={<DPFCleaningPaignton />} />
                    <Route path="/dpf-cleaning-newton-abbot" element={<DPFCleaningNewtonAbbot />} />
                    <Route path="/dpf-diagnostics-devon" element={<DPFDiagnosticsDevon />} />
                    <Route path="/blocked-dpf-cleaning-devon" element={<BlockedDPFCleaningDevon />} />
                    <Route path="/adblue-repair-devon" element={<AdBlueRepairDevon />} />
                    {/* National AdBlue guides (data in src/data/adblue-guides) */}
                    {ADBLUE_GUIDES.map((g) => (
                        <Route key={g.path} path={g.path} element={<AdBlueGuide guide={g} />} />
                    ))}
                    {/* AdBlue town pages: data is injected per page at prerender (see entry-server) */}
                    <Route path="/adblue-repair/areas" element={<AdBlueAreas />} />
                    <Route path="/adblue-repair/:town" element={<AdBlueTown />} />
                    {/* National Stage 1 remap town pages, built the same way */}
                    <Route path="/ecu-remapping/areas" element={<RemapAreas />} />
                    <Route path="/ecu-remapping/:town" element={<RemapTown />} />
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/reviews" element={<ReviewsPage />} />

                    {/* Private trade-outreach campaign landing pages (noindex,
                        nofollow, excluded from the sitemap, never linked publicly).
                        Unknown regional slugs render the 404 page. */}
                    <Route path="/trade-invite/:region" element={<TradeInvite />} />
                    <Route path="/:slug" element={<DynamicPage />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/booking-cancel" element={<BookingCancel />} />
                    <Route path="/debug/dvla" element={<DVLADiagnostic />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
        </div>
    );
}
