import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

// Sticky bottom call/enquire bar shown on mobile only (hidden on lg+).
// Gives phone-led visitors a one-tap way to call or enquire from any page.
export default function MobileCallBar() {
  return (
    <>
      {/* Spacer keeps the fixed bar from covering page/footer content on mobile */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 flex items-stretch gap-px border-t border-white/10 bg-[#1A1D22] pb-[env(safe-area-inset-bottom)]">
        <a
          href="tel:01803269895"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 gradient-orange text-white font-bold text-sm"
          aria-label="Call AutoCleanse on 01803 269895"
        >
          <Phone size={18} /> Call Now
        </a>
        <Link
          to="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0A0A0A] text-white font-bold text-sm hover:text-[#FF7A00] transition-colors"
          aria-label="Send an enquiry to AutoCleanse"
        >
          <Mail size={18} className="text-[#FF7A00]" /> Enquire
        </Link>
      </div>
    </>
  );
}
