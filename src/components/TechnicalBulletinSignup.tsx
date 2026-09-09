import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Loader2, CheckCircle, Mail, Wrench } from 'lucide-react';
import { trackEvent } from '../lib/tracking';

// Site-wide footer sign-up strip for the Auto-Cleanse Technical Bulletin: a
// weekly educational email for the trade about DPF cleaning and ECU work.
//
// Posts to the /api/subscribe-bulletin serverless function, which adds the
// address to a Resend audience server-side (the Resend key never touches the
// browser). No second analytics script - reuses the site's existing GA4/gtag
// via trackEvent.
export default function TechnicalBulletinSignup() {
  const { pathname } = useLocation();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // The private trade-invite campaign pages have their own focused call to
  // action; don't distract from it with a newsletter strip.
  if (pathname.startsWith('/trade-invite/')) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (company) return; // bot filled the honeypot
    if (status === 'submitting') return; // guard duplicate submits

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe-bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, consent: true, company }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setEmail('');
      trackEvent('bulletin_signup', { source: 'footer', page_path: pathname });
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again, or email info@auto-cleanse.co.uk.');
      trackEvent('bulletin_signup_error', { source: 'footer', page_path: pathname });
    }
  };

  return (
    <section
      aria-labelledby="bulletin-heading"
      className="relative z-10 mb-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-[#FF7A00] text-xs font-bold uppercase tracking-widest mb-3">
            <Wrench size={14} aria-hidden="true" /> Technical Bulletin
          </p>
          <h2 id="bulletin-heading" className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            DPF &amp; ECU know-how for the trade.
          </h2>
          <p className="text-white/60 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
            A short weekly email for garages and technicians: real DPF and ECU jobs,
            what the flow data shows, and practical workshop know-how. No sales pitch.
          </p>
        </div>

        <div>
          {status === 'success' ? (
            <div className="flex items-start gap-3 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/30 p-4" role="status">
              <CheckCircle size={20} className="text-[#FF7A00] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-white font-bold text-sm">You&rsquo;re on the list.</p>
                <p className="text-white/60 text-sm mt-0.5">
                  The next Auto-Cleanse technical bulletin will land in your inbox.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
              <label htmlFor="bulletin-email" className="sr-only">
                Your email address
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="bulletin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourgarage.co.uk"
                    aria-invalid={status === 'error'}
                    aria-describedby="bulletin-consent"
                    className="w-full min-h-[48px] bg-black/40 border border-white/15 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-colors"
                  />
                </div>

                {/* Honeypot - visually hidden, ignored by humans, filled by bots. */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="min-h-[48px] btn-shine px-6 py-3 rounded-xl font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                >
                  {status === 'submitting' ? (
                    <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending&hellip;</>
                  ) : (
                    <>Subscribe</>
                  )}
                </button>
              </div>

              <p id="bulletin-consent" className="text-white/40 text-xs leading-relaxed">
                By subscribing you agree to receive the Auto-Cleanse technical bulletin by email.
                No spam, unsubscribe any time. See our{' '}
                <Link to="/privacy" className="text-white/60 underline hover:text-[#FF7A00]">
                  Privacy Policy
                </Link>
                .
              </p>

              {status === 'error' && (
                <p className="text-red-400 text-xs" role="alert">
                  {message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
