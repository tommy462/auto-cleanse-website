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
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}
