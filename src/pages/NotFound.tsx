import { Link } from 'react-router-dom';
import { Phone, Home as HomeIcon } from 'lucide-react';
import SEO from '../components/SEO';

const helpfulLinks = [
  { name: 'DPF Cleaning', path: '/dpf-cleaning' },
  { name: 'ECU Remapping', path: '/ecu-remapping' },
  { name: 'Postal DPF Cleaning', path: '/postal-dpf' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Service Locations', path: '/ecu-remapping-locations' },
  { name: 'Contact Us', path: '/contact' },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 bg-[#0A0A0A] relative overflow-hidden">
      <SEO
        title="Page Not Found | AutoCleanse"
        description="Sorry, the page you were looking for could not be found. Explore our DPF cleaning and ECU remapping services or call AutoCleanse on 01803 269895."
        noindex
      />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF7A00]/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <p className="text-[#FF7A00] font-mono font-bold tracking-widest text-sm mb-4">ERROR 404</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
          Page not found
        </h1>
        <p className="text-white/60 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          The page you were looking for doesn&rsquo;t exist or may have moved. Try one of the links
          below, or give us a call and we&rsquo;ll point you in the right direction.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <Link
            to="/"
            className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-flex items-center justify-center gap-2"
          >
            <HomeIcon size={16} /> Back to Home
          </Link>
          <a
            href="tel:01803269895"
            className="px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
            aria-label="Call AutoCleanse on 01803 269895"
          >
            <Phone size={16} className="text-[#FF7A00]" /> 01803 269895
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
          {helpfulLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="px-4 py-3 rounded-xl bg-[#1A1D22] border border-white/5 text-white/70 hover:text-[#FF7A00] hover:border-[#FF7A00]/20 transition-colors text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
