// Central config for enquiry leads + conversion tracking.
// Keeping these in one place avoids the URL drifting between forms.

// Make.com webhook that receives website enquiries (same endpoint the contact
// form has always used). Webhooks are write-only, so it is safe in the client.
export const LEADS_WEBHOOK_URL =
  'https://hook.eu2.make.com/nh3pvoagqc4y22cg5240jqwcjzjdrpa8';

// Make.com webhook that receives Trade File Service access applications.
// Write-only webhook, safe to call from the client; never rendered as page text.
export const TRADE_LEADS_WEBHOOK_URL =
  'https://hook.eu2.make.com/mlqcw93jdd50wcruo2st9v9yatxr25l3';

// Make.com webhook that receives "free first trade DPF clean" claims from the
// private /trade-invite/* regional campaign landing pages. Kept separate from
// TRADE_LEADS_WEBHOOK_URL so campaign leads land in their own scenario.
export const TRADE_INVITE_WEBHOOK_URL =
  'https://hook.eu2.make.com/ixmeo8jdjg8oj4at58bnni04gr7xqfdm';

// Services a visitor can select in the quick enquiry form.
export const SERVICE_OPTIONS = [
  'DPF Cleaning',
  'DPF Diagnostics',
  'AdBlue / SCR Repair',
  'ECU Remapping',
  'Mobile Remapping',
  'Vehicle Diagnostics',
  'Not sure / Other',
] as const;

// GA4 measurement ID (e.g. "G-XXXXXXXXXX"). Supplied via the VITE_GA4_MEASUREMENT_ID
// environment variable so it is never hardcoded. Left blank → GA4 stays off.
export const GA4_MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() || '';

// Google Ads (gtag) account already loaded in index.html.
export const GOOGLE_ADS_ID = 'AW-17928380785';

// Conversion labels from Google Ads → Conversions. Leave blank until created;
// when set, the tracking helper will also fire a Google Ads conversion hit.
// Format is just the label part, e.g. "abcDEFghIJ".
export const LEAD_CONVERSION_LABEL = '';
export const CALL_CONVERSION_LABEL = '';
