import type { VercelRequest, VercelResponse } from "@vercel/node";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SourceResult {
  make?: string;
  model?: string;
  colour?: string;
  fuelType?: string;
  year?: number;
  engineCapacity?: number;
  transmission?: string;
  bodyType?: string;
  doors?: string;
  taxStatus?: string;
  motStatus?: string;
  co2Emissions?: number;
  source: string;
}

// ─── Token cache (module-level - survives warm Vercel invocations) ─────────────

let _dvsaToken: { value: string; expiry: number } | null = null;

async function getDvsaToken(): Promise<string | null> {
  // Return cached token if still valid (with 60s buffer)
  if (_dvsaToken && Date.now() < _dvsaToken.expiry - 60_000) {
    return _dvsaToken.value;
  }

  const clientId     = process.env.DVSA_CLIENT_ID     ?? '';
  const clientSecret = process.env.DVSA_CLIENT_SECRET ?? '';
  const tenantId     = process.env.DVSA_TENANT_ID     ?? 'a455b827-244f-4c97-b5b4-ce5d13b4d00c';
  if (!clientId || !clientSecret) return null;
  const tokenUrl     = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  try {
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:    'client_credentials',
        client_id:     clientId,
        client_secret: clientSecret,
        scope:         'https://tapi.dvsa.gov.uk/.default',
      }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data.access_token as string;
    const expiresIn = (data.expires_in as number) ?? 3600;
    _dvsaToken = { value: token, expiry: Date.now() + expiresIn * 1000 };
    return token;
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cleanText(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseEngineCc(text: string): number | undefined {
  const t = text.toLowerCase().replace(/,/g, '.');
  let m = t.match(/(\d+\.\d+)\s*cc/);
  if (m) { const v = parseFloat(m[1]); return Math.round(v < 100 ? v * 1000 : v); }
  m = t.match(/(\d{3,4})\s*cc/);
  if (m) return parseInt(m[1], 10);
  m = t.match(/(\d+\.\d+)\s*(?:l|litre)/);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  return undefined;
}

function normaliseMake(make: string): string {
  const MAP: Record<string, string> = {
    VW: 'Volkswagen', VOLKSWAGEN: 'Volkswagen', BMW: 'BMW',
    MERCEDES: 'Mercedes-Benz', 'MERCEDES-BENZ': 'Mercedes-Benz', 'MERCEDES BENZ': 'Mercedes-Benz',
    'LAND ROVER': 'Land Rover', 'ALFA ROMEO': 'Alfa Romeo', 'ASTON MARTIN': 'Aston Martin',
    MINI: 'MINI', FORD: 'Ford', VAUXHALL: 'Vauxhall', TOYOTA: 'Toyota', HONDA: 'Honda',
    NISSAN: 'Nissan', HYUNDAI: 'Hyundai', KIA: 'Kia', SKODA: 'Škoda', SEAT: 'SEAT',
    AUDI: 'Audi', PEUGEOT: 'Peugeot', RENAULT: 'Renault', CITROEN: 'Citroën', CITROËN: 'Citroën',
    FIAT: 'Fiat', VOLVO: 'Volvo', MAZDA: 'Mazda', SUBARU: 'Subaru', MITSUBISHI: 'Mitsubishi',
    SUZUKI: 'Suzuki', LEXUS: 'Lexus', TESLA: 'Tesla', PORSCHE: 'Porsche', JAGUAR: 'Jaguar',
    BENTLEY: 'Bentley', JEEP: 'Jeep', DODGE: 'Dodge', MG: 'MG', ROVER: 'Rover', SAAB: 'Saab',
    DACIA: 'Dacia', CUPRA: 'CUPRA', POLESTAR: 'Polestar', 'ROLLS ROYCE': 'Rolls-Royce',
    INFINITI: 'Infiniti', GENESIS: 'Genesis', MASERATI: 'Maserati', FERRARI: 'Ferrari',
    LAMBORGHINI: 'Lamborghini', MCLAREN: 'McLaren',
  };
  const upper = make.trim().toUpperCase();
  return MAP[upper] ?? make.trim().replace(/\b\w/g, c => c.toUpperCase());
}

function normaliseModel(model: string): string {
  if (!model) return '';
  let m = model.replace(/\b[A-Z]{2}\d{2}[A-Z]{3}\b/g, '').trim();
  const words = m.toUpperCase().split(/\s+/).filter(Boolean);
  // Remove adjacent duplicates
  const deduped: string[] = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (words[i] !== words[i - 1]) deduped.push(words[i]);
  }
  // Strip longest repeated suffix
  const n = deduped.length;
  for (let sl = Math.floor(n / 2); sl > 1; sl--) {
    const suffix = deduped.slice(n - sl).join(' ');
    for (let start = 0; start < n - sl; start++) {
      if (deduped.slice(start, start + sl).join(' ') === suffix) {
        return deduped.slice(0, start + sl).join(' ');
      }
    }
  }
  return deduped.join(' ');
}

// ─── Source 1: DVSA MOT History API (OAuth2) ─────────────────────────────────
// Official government API - always accessible from server IPs, returns full make+model

async function fetchDvsaMot(plate: string): Promise<SourceResult | null> {
  const token = await getDvsaToken();
  if (!token) return null;

  const apiKey = process.env.DVSA_API_KEY ?? '';

  try {
    const url = `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${plate}`;
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-api-key': apiKey,
        'Accept': 'application/json+v6',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const d = await res.json();

    // The API returns an array or a single object depending on version
    const vehicle = Array.isArray(d) ? d[0] : d;
    if (!vehicle) return null;

    return {
      make:           vehicle.make           ? normaliseMake(vehicle.make)                   : undefined,
      model:          vehicle.model          ? normaliseModel(vehicle.model.toUpperCase())    : undefined,
      colour:         vehicle.primaryColour  ? vehicle.primaryColour.charAt(0).toUpperCase() + vehicle.primaryColour.slice(1).toLowerCase() : undefined,
      fuelType:       vehicle.fuelType       ? vehicle.fuelType.charAt(0).toUpperCase()      + vehicle.fuelType.slice(1).toLowerCase()       : undefined,
      year:           vehicle.manufactureYear ?? undefined,
      engineCapacity: vehicle.cylinderCapacity ?? undefined,
      source: 'DVSA MOT History API',
    };
  } catch {
    return null;
  }
}

// ─── Source 2: DVLA VES API ──────────────────────────────────────────────────
// Gives: make, colour, fuel, year, engine CC, tax/MOT status - no model

async function fetchDvlaVes(plate: string): Promise<SourceResult | null> {
  const apiKey = process.env.DVLA_API_KEY ?? '4JQVcz4V9m9ymInn22ThJ42t3ePusqHh3PJ38z8i';
  try {
    const res = await fetch(
      'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
      {
        method: 'POST',
        headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationNumber: plate }),
        signal: AbortSignal.timeout(4000),
      }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      make:           d.make       ? normaliseMake(d.make) : undefined,
      colour:         d.colour     ? d.colour.charAt(0).toUpperCase()   + d.colour.slice(1).toLowerCase()   : undefined,
      fuelType:       d.fuelType   ? d.fuelType.charAt(0).toUpperCase() + d.fuelType.slice(1).toLowerCase() : undefined,
      year:           d.yearOfManufacture,
      engineCapacity: d.engineCapacity,
      taxStatus:      d.taxStatus,
      motStatus:      d.motStatus,
      co2Emissions:   d.co2Emissions,
      source: 'DVLA VES API',
    };
  } catch {
    return null;
  }
}

// ─── Source 3: carcheck.co.uk ─────────────────────────────────────────────────
// Best supplementary data (gearbox, body type, doors) if accessible

async function fetchCarcheck(plate: string): Promise<SourceResult | null> {
  try {
    const url = `https://www.carcheck.co.uk/numberplate/${plate}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Upgrade-Insecure-Requests': '1',
        'DNT': '1',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (html.includes('cf-browser-verification') || html.includes('Checking your browser') || html.length < 500) return null;

    const result: SourceResult = { source: 'carcheck.co.uk' };
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    for (const tr of trMatches) {
      const cells = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [];
      if (cells.length < 2) continue;
      const label = cleanText(cells[0]).toLowerCase();
      const value = cleanText(cells[cells.length - 1]);
      if (!label || !value || /^[?\s]+$/.test(value)) continue;
      if (['n/a', '-', '–'].includes(value.toLowerCase())) continue;

      if (label === 'make')                              result.make = normaliseMake(value);
      else if (label === 'model')                        result.model = normaliseModel(value);
      else if (label === 'colour')                       result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'fuel type')                    result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'year of manufacture')          { const y = value.match(/\d{4}/); if (y) result.year = parseInt(y[0], 10); }
      else if (label === 'engine capacity')              result.engineCapacity = parseEngineCc(value);
      else if (label === 'gearbox')                      { const tx = value.replace(/^[-–\s]+/, '').trim(); if (tx) result.transmission = tx.charAt(0).toUpperCase() + tx.slice(1).toLowerCase(); }
      else if (label === 'body type' || label === 'body style') result.bodyType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'number of doors')              result.doors = value;
    }
    return result.make ? result : null;
  } catch {
    return null;
  }
}

// ─── Merge ───────────────────────────────────────────────────────────────────
// Priority: DVSA MOT (has real model) > DVLA VES (authoritative basic data) > carcheck (extra fields)

function merge(results: (SourceResult | null)[]): SourceResult & { sources: string[]; confidence: string } {
  const valid = results.filter(Boolean) as SourceResult[];
  const priority = ['DVSA MOT History API', 'DVLA VES API', 'carcheck.co.uk'];
  const sorted = [...valid].sort((a, b) => {
    const ai = priority.findIndex(p => a.source.includes(p));
    const bi = priority.findIndex(p => b.source.includes(p));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const merged: SourceResult = { source: '' };
  const fields: (keyof SourceResult)[] = [
    'make', 'model', 'colour', 'fuelType', 'year',
    'engineCapacity', 'transmission', 'bodyType', 'doors',
    'taxStatus', 'motStatus', 'co2Emissions',
  ];
  for (const field of fields) {
    for (const src of sorted) {
      const val = src[field];
      if (val !== undefined && val !== null && val !== '') {
        (merged as any)[field] = val;
        break;
      }
    }
  }

  const sources = [...new Set(sorted.map(s => s.source))];
  const hasMake  = Boolean(merged.make);
  const hasModel = Boolean(merged.model);
  const usedDvsa = sources.includes('DVSA MOT History API');

  let confidence: string;
  if (hasMake && hasModel && usedDvsa)        confidence = 'HIGH';
  else if (hasMake && hasModel)               confidence = 'MEDIUM';
  else if (hasMake)                           confidence = 'LOW';
  else                                        confidence = 'VERY LOW';

  return { ...merged, sources, confidence };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { registration } = (req.body || {}) as { registration?: string };
    if (!registration) return res.status(400).json({ error: 'Missing registration' });

    const plate = registration.trim().toUpperCase().replace(/\s+/g, '');

    // Run all sources concurrently - DVSA is primary (OAuth2, always works from server)
    const [dvsaResult, dvlaResult, carcheckResult] = await Promise.allSettled([
      fetchDvsaMot(plate),
      fetchDvlaVes(plate),
      fetchCarcheck(plate),
    ]);

    const results = [
      dvsaResult.status    === 'fulfilled' ? dvsaResult.value    : null,
      dvlaResult.status    === 'fulfilled' ? dvlaResult.value    : null,
      carcheckResult.status === 'fulfilled' ? carcheckResult.value : null,
    ];

    const merged = merge(results);

    if (!merged.make) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    return res.status(200).json({
      make:             merged.make,
      model:            merged.model            ?? null,
      colour:           merged.colour           ?? null,
      fuelType:         merged.fuelType         ?? null,
      yearOfManufacture: merged.year            ?? null,
      engineCapacity:   merged.engineCapacity   ?? null,
      taxStatus:        merged.taxStatus        ?? null,
      motStatus:        merged.motStatus        ?? null,
      co2Emissions:     merged.co2Emissions     ?? null,
      transmission:     merged.transmission     ?? null,
      bodyType:         merged.bodyType         ?? null,
      doors:            merged.doors            ?? null,
      confidence:       merged.confidence,
      sources:          merged.sources,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
}
