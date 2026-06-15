import { Link } from 'react-router-dom';
import { Star, Phone, ExternalLink } from 'lucide-react';
import { GOOGLE_REVIEWS_URL, type Review } from '../data/reviews';

interface ReviewsProps {
  reviews: Review[];
  heading?: React.ReactNode;
  intro?: string;
  /** Max columns on large screens. Cards always stack to 1 on mobile. */
  columns?: 2 | 3;
  showGoogleCta?: boolean;
  showCallCta?: boolean;
  showContactCta?: boolean;
  showInternalLinks?: boolean;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-[#FF7A00] text-[#FF7A00]' : 'fill-white/10 text-white/10'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="break-inside-avoid mb-6 rounded-2xl bg-[#111317] border border-white/5 p-6 hover:border-[#FF7A00]/30 transition-colors duration-300">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Stars rating={review.rating} />
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border border-white/10 text-white/55 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" aria-hidden="true" />
          {review.source}
        </span>
      </div>

      <blockquote className="text-white/80 text-[15px] leading-relaxed whitespace-pre-line mb-5">
        {review.text}
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-[#1A1D22] to-black border border-white/10 flex items-center justify-center">
          <span className="text-[#FF7A00] font-bold text-xs">{review.initials}</span>
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold text-sm truncate">{review.name}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {review.company && (
              <span className="text-xs text-white/45 font-medium">{review.company}</span>
            )}
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20">
              {review.serviceCategory}
            </span>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export default function Reviews({
  reviews,
  heading = (
    <>
      <span className="text-white">What Our </span>
      <span className="text-[#FF7A00]">Customers Say</span>
    </>
  ),
  intro,
  columns = 3,
  showGoogleCta = true,
  showCallCta = true,
  showContactCta = false,
  showInternalLinks = false,
}: ReviewsProps) {
  if (!reviews.length) return null;

  const colClass =
    columns === 2 ? 'columns-1 sm:columns-2' : 'columns-1 sm:columns-2 lg:columns-3';

  return (
    <div>
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{heading}</h2>
        {intro && <p className="text-white/50 text-base md:text-lg mt-4 leading-relaxed">{intro}</p>}
      </div>

      <div className={`${colClass} gap-x-6`}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {(showGoogleCta || showCallCta || showContactCta) && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
          {showGoogleCta && GOOGLE_REVIEWS_URL && (
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine px-6 py-3 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2"
            >
              Read more Google reviews <ExternalLink size={15} />
            </a>
          )}
          {showContactCta && (
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2"
            >
              Request a Callback
            </Link>
          )}
          {showCallCta && (
            <a
              href="tel:01803269895"
              className="px-6 py-3 rounded-xl font-bold text-sm text-white border border-white/15 hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2"
              aria-label="Call Auto-Cleanse on 01803 269895"
            >
              <Phone size={15} className="text-[#FF7A00]" /> Call Auto-Cleanse
            </a>
          )}
        </div>
      )}

      {showInternalLinks && (
        <p className="text-center text-sm text-white/40 mt-6">
          Explore{' '}
          <Link to="/dpf-cleaning-devon" className="text-white/70 hover:text-[#FF7A00] transition-colors">DPF cleaning in Devon</Link>
          {' · '}
          <Link to="/ecu-remapping" className="text-white/70 hover:text-[#FF7A00] transition-colors">ECU remapping</Link>
          {' · '}
          <Link to="/contact" className="text-white/70 hover:text-[#FF7A00] transition-colors">contact us</Link>
        </p>
      )}
    </div>
  );
}
