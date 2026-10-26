import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Reviews from '../components/Reviews';
import { REVIEWS, GOOGLE_REVIEWS_URL } from '../data/reviews';

// Every review in src/data/reviews.ts, word for word, with a plain note on where
// they come from. Consumer law (DMCC Act 2024) bans fake reviews and reviews
// presented in a misleading way, so the note and the Google link must stay, and
// the page must never carry Review/AggregateRating schema (see reviews.ts).

export default function ReviewsPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <SEO
        title="Customer Reviews | Auto-Cleanse DPF Cleaning & ECU Remapping"
        description="Reviews from Auto-Cleanse customers and garages for DPF cleaning, diagnostics, AdBlue repair and ECU remapping, shown word for word."
        path="/reviews"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Customer <span className="text-[#FF7A00]">Reviews</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg mt-5 leading-relaxed">
            What customers and garages have said about our DPF cleaning, diagnostics and ECU
            remapping.
          </p>
        </div>

        <Reviews
          reviews={REVIEWS}
          heading={<span className="sr-only">All reviews</span>}
          columns={3}
          collapseOnMobile={false}
          showGoogleCta
          showCallCta
        />

        <div className="max-w-3xl mx-auto mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 text-sm text-white/60 leading-relaxed">
          <h2 className="text-white font-bold text-base mb-2">About these reviews</h2>
          <p>
            Every review here is real and shown word for word. Reviews marked &ldquo;Google
            Review&rdquo; were left on our Google Business Profile. &ldquo;Customer Feedback&rdquo;
            was sent to us directly by customers and garages. These are the reviews we have copied
            onto our website. You can read all of our Google reviews, including any not shown here,{' '}
            {GOOGLE_REVIEWS_URL ? (
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] underline underline-offset-2">
                on Google
              </a>
            ) : 'on Google'}
            .
          </p>
          <p className="mt-3">
            Had work done by us?{' '}
            <Link to="/contact" className="text-[#FF7A00] underline underline-offset-2">Get in touch</Link>{' '}
            if anything wasn't right, so we can put it right.
          </p>
        </div>
      </div>
    </div>
  );
}
