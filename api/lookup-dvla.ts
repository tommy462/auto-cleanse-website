import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Optional: Add CORS for the specific domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { registration } = (req.body || {}) as { registration?: string };
    if (!registration) return res.status(400).json({ error: "Missing registration" });

    // In a production environment, you should add some form of authentication 
    // or rate limiting here to protect your API key.
    
    const dvlaApiKey = process.env.DVLA_API_KEY || '4JQVcz4V9m9ymInn22ThJ42t3ePusqHh3PJ38z8i';

    // Call DVLA API
    const dvlaResponse = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': dvlaApiKey,
      },
      body: JSON.stringify({ registrationNumber: registration }),
    });

    if (!dvlaResponse.ok) {
      if (dvlaResponse.status === 404) return res.status(404).json({ error: 'Vehicle not found' });
      if (dvlaResponse.status === 403) return res.status(403).json({ error: 'Invalid API Key' });
      const errorText = await dvlaResponse.text();
      return res.status(dvlaResponse.status).json({ error: `DVLA API error: ${errorText}` });
    }

    const data = await dvlaResponse.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}
