import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Postal DPF', path: '/postal-dpf' },
    { name: 'Why Clean?', path: '/why-clean' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Our Process', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialIcons = [
    { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61573744325360' },
    { Icon: Instagram, href: 'https://www.instagram.com/auto_cleansedpf/' },
    { Icon: Youtube, href: 'https://www.youtube.com/@Auto-Cleanse' },
  ];

  return (
    <>
      {/* Main Header */}
      <header
        className={`sticky z-50 transition-all duration-700 ease-in-out ${isScrolled
          ? 'top-2 mx-2 md:mx-auto max-w-[98%] lg:max-w-7xl rounded-2xl md:rounded-[2rem] glass-panel-heavy border border-white/10 shadow-2xl shadow-black/80 py-1'
          : 'top-0 mx-0 max-w-full gradient-bg-primary border-b border-[#1A1D22] py-2'
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-700 ${isScrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <img
                src="/UniversalUpscaler_2dfd4994-6f3d-4696-9702-f0cd99f34a8c (1).png"
                alt="AutoCleanse DPF Specialists Logo"
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              <img
                src="/autocleanse-text-logo.png"
                alt="AutoCleanse"
                className="h-3 sm:h-4 lg:h-[18px] object-contain brightness-0 invert opacity-90"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center flex-1 justify-center space-x-4 xl:space-x-8 mx-4 overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-[#FF7A00] relative ${location.pathname === item.path ? 'text-[#FF7A00]' : 'text-white'
                    }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF7A00]"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs and Social */}
            <div className="hidden lg:flex items-center space-x-4 shrink-0">
              {/* Social Icons */}
              <div className="flex items-center space-x-2 mr-4">
                {socialIcons.map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-[#FF7A00] transition-colors p-1"
                    aria-label={`Follow us on ${Icon.name}`}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>

              {/* Book Now Button */}
              <MagneticButton>
                <Link
                  to="/postal-dpf"
                  className="btn-shine px-6 py-2 rounded-lg font-medium text-sm text-white hover:text-white"
                >
                  Book Now
                </Link>
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-[#FF7A00] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden gradient-bg-secondary border-t border-[#1A1D22] absolute left-0 right-0 top-full mt-2 mx-4 rounded-2xl overflow-hidden glass-panel-heavy shadow-2xl`}>
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors hover:text-[#FF7A00] ${location.pathname === item.path ? 'text-[#FF7A00]' : 'text-white'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-3">
                <MagneticButton className="w-full">
                  <Link
                    to="/postal-dpf"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full btn-shine px-6 py-2 rounded-lg font-medium text-sm text-white hover:text-white block text-center shadow-lg hover:shadow-[#FF7A00]/20"
                  >
                    Book Now
                  </Link>
                </MagneticButton>

                {/* Mobile Social Icons */}
                <div className="flex items-center space-x-4 pt-2 justify-center">
                  {socialIcons.map(({ Icon, href }, index) => (
                    <a
                      key={index}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#FF7A00] transition-colors"
                      aria-label={`Follow us on ${Icon.name}`}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;