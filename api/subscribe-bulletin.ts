import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Adds a subscriber to the Auto-Cleanse "Technical Bulletin" list in Resend.
//
// Runs server-side ONLY, so the Resend API key is never exposed to the browser.
// Uses Resend's official SDK so we track their current API rather than a
// hand-rolled endpoint (Resend has moved from Audiences to Segments).
//
// Required environment variable (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   your Resend API key (starts "re_"), with Full access
//
// Optional - set whichever your Resend dashboard shows so subscribers are
// grouped for the broadcast. If neither is set, the contact is still created at
// the account level.
//   RESEND_BULLETIN_SEGMENT_ID    a Resend Segment id  (current model, preferred)
//   RESEND_BULLETIN_AUDIENCE_ID   a Resend Audience id (legacy, still supported)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SEGMENT_ID = process.env.RESEND_BULLETIN_SEGMENT_ID;
// The website form only writes NEW subscribers, and they go into the dedicated
// "new signups" audience (named RESEND_BULLETIN_AUDIENCE_3_ID in Vercel). The
// other two audiences are existing lists the site never touches. Falls back to
// the canonical name if the env var is ever renamed.
const AUDIENCE_ID =
  process.env.RESEND_BULLETIN_AUDIENCE_3_ID ?? process.env.RESEND_BULLETIN_AUDIENCE_ID;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, consent, company } = req.body ?? {};

  // Honeypot: real users never fill the hidden "company" field. Silently accept
  // so bots get a success response but nothing is stored.
  if (company) return res.status(200).json({ ok: true });

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if (consent !== true) {
    return res.status(400).json({ error: 'Consent is required to subscribe.' });
  }
  if (!RESEND_API_KEY) {
    console.error('[subscribe-bulletin] Missing RESEND_API_KEY');
    return res.status(500).json({ error: 'Subscription is temporarily unavailable.' });
  }

  const resend = new Resend(RESEND_API_KEY);
  const clean = email.trim().toLowerCase();

  try {
    // Branch the call so each matches its SDK overload cleanly.
    const result = SEGMENT_ID
      ? await resend.contacts.create({ email: clean, unsubscribed: false, segments: [{ id: SEGMENT_ID }] })
      : AUDIENCE_ID
        ? await resend.contacts.create({ audienceId: AUDIENCE_ID, email: clean, unsubscribed: false })
        : await resend.contacts.create({ email: clean, unsubscribed: false });

    if (result.error) {
      // An already-present contact is a success from the visitor's point of view.
      // (Don't re-fire the welcome for someone who already subscribed.)
      if (/already|exists|duplicate/i.test(result.error.message ?? '')) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      console.error('[subscribe-bulletin] Resend error', result.error);
      return res.status(502).json({ error: 'Could not complete subscription. Please try again.' });
    }

    // New subscriber: fire the Resend event that triggers the welcome automation.
    // Resend automations are event-driven, so a "contact added" trigger doesn't
    // exist in the dashboard; the app has to emit the event. This must match the
    // trigger event name set on the automation in Resend: "bulletin.subscribed".
    // Non-fatal: the subscribe itself has already succeeded, so a welcome hiccup
    // (or the automation not being set up yet) must not fail the request.
    try {
      const ev = await resend.events.send({ event: 'bulletin.subscribed', email: clean });
      if (ev.error) console.error('[subscribe-bulletin] welcome event error (non-fatal)', ev.error);
    } catch (e) {
      console.error('[subscribe-bulletin] welcome event threw (non-fatal)', e);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe-bulletin]', err);
    return res.status(500).json({ error: 'Internal error.' });
  }
}
