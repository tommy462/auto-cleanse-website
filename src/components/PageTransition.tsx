import { useEffect } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

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
import NotFound from '../pages/NotFound';

export default function PageTransition() {
    const location = useLocation();

    useEffect(() => {
        // Top out scroll when route changes
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transitionEnd: { filter: 'none', transform: 'none' }
                }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full h-full"
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
                    <Route path="/blog" element={<BlogIndex />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/:slug" element={<DynamicPage />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/booking-cancel" element={<BookingCancel />} />
                    <Route path="/debug/dvla" element={<DVLADiagnostic />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}
