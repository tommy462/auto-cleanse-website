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
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative bg-[#050505] overflow-hidden pt-24 pb-8 border-t border-white/5">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#FF7A00]/5 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">

          {/* Heavy CTA Column */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Ready to restore<br /><span className="text-white/40 italic font-medium">expertly?</span>
            </h2>
            <p className="text-lg text-white/60 max-w-md font-medium leading-relaxed">
              Professional DPF refurbishment services. Same-day return within 30 miles of Totnes. Trade-friendly pricing arrays.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <MagneticButton>
                <a href="tel:08000430609" className="btn-shine px-8 py-4 rounded-xl font-bold text-lg text-white hover:text-white inline-block shadow-2xl shadow-[#FF7A00]/20">
                  Call Us
                </a>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="px-8 py-4 rounded-xl font-bold text-lg text-white border border-white/20 hover:bg-white/10 transition-colors inline-block">
                  Contact Form
                </Link>
              </MagneticButton>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:mt-8">
            <nav aria-label="Footer quick links">
              <h3 className="text-white font-bold mb-8 text-sm tracking-widest uppercase text-white/40">Navigation</h3>
              <ul className="space-y-5">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-white/80 hover:text-[#FF7A00] transition-colors text-lg relative group inline-block font-medium">
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF7A00] transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="text-white font-bold mb-8 text-sm tracking-widest uppercase text-white/40">Connect</h3>
              <ul className="space-y-5">
                {socialLinks.map(({ Icon, href, name }) => (
                  <li key={name}>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#FF7A00] transition-colors text-lg flex items-center group font-medium">
                      <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-3">
                        <Icon size={20} className="text-white/60 group-hover:text-[#FF7A00] transition-colors" /> {name}
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href="tel:08000430609" className="text-white/80 hover:text-[#FF7A00] transition-colors text-lg flex items-center group font-medium">
                    <span className="group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-3">
                      Call Us
                    </span>
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
            <span>Same-day Return (Locally)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;