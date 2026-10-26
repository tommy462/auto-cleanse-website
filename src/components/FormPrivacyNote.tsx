import { Link } from 'react-router-dom';

// One-line privacy notice shown at the point a form collects personal data.
// Enquiry forms rely on "steps before a contract", not consent, so this is a
// notice rather than a tick box (a forced consent box would be the wrong basis).
export default function FormPrivacyNote({
  purpose = 'to reply to your enquiry',
  className = '',
}: {
  /** Finishes "We use these details ..." */
  purpose?: string;
  className?: string;
}) {
  return (
    <p className={`text-white/40 text-xs leading-relaxed ${className}`}>
      We use these details {purpose}. See our{' '}
      <Link to="/privacy" className="text-white/60 underline underline-offset-2 hover:text-[#FF7A00]">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
