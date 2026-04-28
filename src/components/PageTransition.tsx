import { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
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
import DPFCleaningTotnes from '../pages/DPFCleaningTotnes';
import DPFCleaningDevon from '../pages/DPFCleaningDevon';
import Remapping from '../pages/Remapping';
import RemappingBooking from '../pages/RemappingBooking';
import DPFCleaningExeter from '../pages/DPFCleaningExeter';
import DPFCleaningPlymouth from '../pages/DPFCleaningPlymouth';
import DPFCleaningTorquay from '../pages/DPFCleaningTorquay';
import DPFCleaningPaignton from '../pages/DPFCleaningPaignton';
import RemappingDevon from '../pages/RemappingDevon';
import RemappingLocation from '../pages/RemappingLocation';
import BookingSuccess from '../pages/BookingSuccess';
import BookingCancel from '../pages/BookingCancel';

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
                    <Route path="/dpf-cleaning-totnes" element={<DPFCleaningTotnes />} />
                    <Route path="/dpf-cleaning-devon" element={<DPFCleaningDevon />} />
                    <Route path="/remapping" element={<Remapping />} />
                    <Route path="/remapping-booking" element={<RemappingBooking />} />
                    <Route path="/dpf-cleaning-exeter" element={<DPFCleaningExeter />} />
                    <Route path="/dpf-cleaning-plymouth" element={<DPFCleaningPlymouth />} />
                    <Route path="/dpf-cleaning-torquay" element={<DPFCleaningTorquay />} />
                    <Route path="/dpf-cleaning-paignton" element={<DPFCleaningPaignton />} />
                    <Route path="/remapping-devon" element={<RemappingDevon />} />
                    <Route path="/:slug" element={<RemappingLocation />} />
                    <Route path="/booking-success" element={<BookingSuccess />} />
                    <Route path="/booking-cancel" element={<BookingCancel />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}
