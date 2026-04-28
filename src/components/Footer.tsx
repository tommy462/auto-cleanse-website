import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61573744325360', name: 'Facebook' },
    { Icon: Instagram, href: 'https://www.instagram.com/auto_cleansedpf/', name: 'Instagram' },
    { Icon: Youtube, href: 'https://www.youtube.com/@Auto-Cleanse', name: 'YouTube' },
  ];

  const quickLinks = [
    { name: 'DPF Cleaning', path: '/services' },
    { name: 'ECU Remapping', path: '/ecu-remapping' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const popularLocations = [
    { name: 'Plymouth', path: '/ecu-remapping-plymouth' },
    { name: 'Exeter', path: '/ecu-remapping-exeter' },
    { name: 'Torquay', path: '/ecu-remapping-torquay' },
    { name: 'Newton Abbot', path: '/ecu-remapping-newton-abbot' },
    { name: 'Totnes', path: '/ecu-remapping-totnes' },
    { name: 'View All', path: '/ecu-remapping-locations' },
  ];

  const popularVehicles = [
    { name: 'Ford Transit Custom', path: '/ford-transit-custom-remap' },
    { name: 'VW Transporter', path: '/vw-transporter-remap' },
    { name: 'Audi A3', path: '/audi-a3-remap' },
    { name: 'BMW 3 Series', path: '/bmw-3-series-remap' },
    { name: 'Land Rover Discovery', path: '/land-rover-discovery-remap' },
    { name: 'View All', path: '/vehicle-remapping' },
  ];

  return (
    <footer className="relative bg-[#050505] overflow-hidden pt-24 pb-8 border-t border-white/5">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF7A00]/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Heavy CTA Column */}
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
              Ready to restore<br /><span className="text-[#FF7A00] italic font-medium">expertly?</span>
            </h2>
            <p className="text-sm text-white/60 max-w-sm font-medium leading-relaxed">
              Professional DPF cleaning &amp; ECU remapping services. Same-day return within 30 miles of Totnes. Trade-friendly pricing.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-4">
              <MagneticButton className="inline-block">
                <a href="tel:08000430609" className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white hover:text-white inline-block shadow-2xl shadow-[#FF7A00]/20 text-center w-full sm:w-auto lg:w-full">
                  Call Us
                </a>
              </MagneticButton>
              <MagneticButton className="inline-block">
                <Link to="/contact" className="px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/20 hover:bg-white/10 transition-colors inline-block text-center w-full sm:w-auto lg:w-full">
                  Contact Form
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:mt-2">
            <nav aria-label="Footer quick links">
              <h3 className="text-white font-bold mb-6 text-xs tracking-widest uppercase text-white/40">Services</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-white/70 hover:text-[#FF7A00] transition-colors text-sm relative group inline-block font-medium">
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Popular Vehicles">
              <h3 className="text-white font-bold mb-6 text-xs tracking-widest uppercase text-white/40">Vehicles</h3>
              <ul className="space-y-4">
                {popularVehicles.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-white/70 hover:text-[#FF7A00] transition-colors text-sm relative group inline-block font-medium">
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Popular Locations">
              <h3 className="text-white font-bold mb-6 text-xs tracking-widest uppercase text-white/40">Locations</h3>
              <ul className="space-y-4">
                {popularLocations.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-white/70 hover:text-[#FF7A00] transition-colors text-sm relative group inline-block font-medium">
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-white font-bold mb-6 text-xs tracking-widest uppercase text-white/40">Connect</h3>
              <ul className="space-y-4">
                {socialLinks.map(({ Icon, href, name }) => (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#FF7A00] transition-colors text-sm flex items-center group font-medium">
                      <Icon size={16} className="text-white/40 group-hover:text-[#FF7A00] transition-colors mr-2" /> {name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="tel:08000430609" className="text-white/70 hover:text-[#FF7A00] transition-colors text-sm flex items-center group font-medium">
                    Call Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Mega Typography */}
        <div className="w-full flex justify-center items-center border-t border-white/10 pt-16 pb-12 overflow-hidden px-4">
          <div aria-hidden="true" className="text-[8.5vw] font-black text-white-[0.03] text-transparent outline-text opacity-40 tracking-tighter leading-none select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)', color: 'transparent' }}>
            AUTOCLEANSE
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm mt-4 pt-8 border-t border-white/5 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-orange rounded-md flex items-center justify-center text-white font-bold text-xs">AC</div>
            <p>© {new Date().getFullYear()} AutoCleanse. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs tracking-wider uppercase">
            <span>Guaranteed Quality</span>
            <span className="text-[#FF7A00]">•</span>
            <span>DPF Cleaning &amp; ECU Remapping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;