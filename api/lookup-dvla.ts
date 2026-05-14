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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cleanText(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseEngineCc(text: string): number | undefined {
  const t = text.toLowerCase().replace(/,/g, '.');
  let m = t.match(/(\d+\.\d+)\s*cc/);
  if (m) {
    const val = parseFloat(m[1]);
    return Math.round(val < 100 ? val * 1000 : val);
  }
  m = t.match(/(\d{3,4})\s*cc/);
  if (m) return parseInt(m[1], 10);
  m = t.match(/(\d+\.\d+)\s*(?:l|litre)/);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  return undefined;
}

function normaliseMake(make: string): string {
  const MAP: Record<string, string> = {
    VW: 'Volkswagen', VOLKSWAGEN: 'Volkswagen', BMW: 'BMW',
    MERCEDES: 'Mercedes-Benz', 'MERCEDES-BENZ': 'Mercedes-Benz',
    'MERCEDES BENZ': 'Mercedes-Benz',
    'LAND ROVER': 'Land Rover', 'ALFA ROMEO': 'Alfa Romeo',
    'ASTON MARTIN': 'Aston Martin', MINI: 'MINI', FORD: 'Ford',
    VAUXHALL: 'Vauxhall', TOYOTA: 'Toyota', HONDA: 'Honda',
    NISSAN: 'Nissan', HYUNDAI: 'Hyundai', KIA: 'Kia',
    SKODA: 'Škoda', SEAT: 'SEAT', AUDI: 'Audi', PEUGEOT: 'Peugeot',
    RENAULT: 'Renault', CITROEN: 'Citroën', CITROËN: 'Citroën',
    FIAT: 'Fiat', VOLVO: 'Volvo', MAZDA: 'Mazda', SUBARU: 'Subaru',
    MITSUBISHI: 'Mitsubishi', SUZUKI: 'Suzuki', LEXUS: 'Lexus',
    TESLA: 'Tesla', PORSCHE: 'Porsche', JAGUAR: 'Jaguar',
    BENTLEY: 'Bentley', JEEP: 'Jeep', DODGE: 'Dodge', MG: 'MG',
    ROVER: 'Rover', SAAB: 'Saab', DACIA: 'Dacia', CUPRA: 'CUPRA',
    POLESTAR: 'Polestar', 'ROLLS ROYCE': 'Rolls-Royce',
    INFINITI: 'Infiniti', GENESIS: 'Genesis', MASERATI: 'Maserati',
    FERRARI: 'Ferrari', LAMBORGHINI: 'Lamborghini', MCLAREN: 'McLaren',
  };
  const upper = make.trim().toUpperCase();
  return MAP[upper] ?? make.trim().replace(/\b\w/g, c => c.toUpperCase());
}

function normaliseModel(model: string): string {
  if (!model) return '';
  let m = model.replace(/\b[A-Z]{2}\d{2}[A-Z]{3}\b/g, '').trim();
  const words = m.toUpperCase().split(/\s+/);
  const deduped: string[] = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (words[i] !== words[i - 1]) deduped.push(words[i]);
  }
  // Also strip longest repeated suffix
  const w = deduped;
  const n = w.length;
  for (let suffixLen = Math.floor(n / 2); suffixLen > 1; suffixLen--) {
    const suffix = w.slice(n - suffixLen);
    for (let start = 0; start < n - suffixLen; start++) {
      if (w.slice(start, start + suffixLen).join(' ') === suffix.join(' ')) {
        return w.slice(0, start + suffixLen).join(' ');
      }
    }
  }
  return deduped.join(' ');
}

// ─── Source 1: DVLA VES API ──────────────────────────────────────────────────

async function fetchDvlaVes(plate: string, apiKey: string): Promise<SourceResult | null> {
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
      make: d.make ? normaliseMake(d.make) : undefined,
      colour: d.colour ? d.colour.charAt(0).toUpperCase() + d.colour.slice(1).toLowerCase() : undefined,
      fuelType: d.fuelType ? d.fuelType.charAt(0).toUpperCase() + d.fuelType.slice(1).toLowerCase() : undefined,
      year: d.yearOfManufacture,
      engineCapacity: d.engineCapacity,
      taxStatus: d.taxStatus,
      motStatus: d.motStatus,
      co2Emissions: d.co2Emissions,
      source: 'DVLA VES API',
    };
  } catch {
    return null;
  }
}

// ─── Source 2: carcheck.co.uk ────────────────────────────────────────────────

async function fetchCarcheck(plate: string): Promise<SourceResult | null> {
  try {
    const url = `https://www.carcheck.co.uk/numberplate/${plate}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
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
    // If blocked by Cloudflare or bot detection, bail early
    if (html.includes('cf-browser-verification') || html.includes('Checking your browser') || html.length < 500) return null;

    const result: SourceResult = { source: 'carcheck.co.uk' };
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const tr of trMatches) {
      const cellMatches = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [];
      if (cellMatches.length < 2) continue;
      const label = cleanText(cellMatches[0]).toLowerCase();
      const value = cleanText(cellMatches[cellMatches.length - 1]);
      if (!label || !value || /^[?\s]+$/.test(value)) continue;
      if (value.toLowerCase() === 'n/a' || value === '-' || value === '–') continue;

      if (label === 'make') result.make = normaliseMake(value);
      else if (label === 'model') result.model = normaliseModel(value);
      else if (label === 'colour') result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'fuel type') result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'year of manufacture') { const y = value.match(/\d{4}/); if (y) result.year = parseInt(y[0], 10); }
      else if (label === 'engine capacity') result.engineCapacity = parseEngineCc(value);
      else if (label === 'gearbox') { const tx = value.replace(/^[-–\s]+/, '').trim(); if (tx) result.transmission = tx.charAt(0).toUpperCase() + tx.slice(1).toLowerCase(); }
      else if (label === 'body type' || label === 'body style') result.bodyType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label === 'number of doors') result.doors = value;
    }

    return result.make ? result : null;
  } catch {
    return null;
  }
}

// ─── Source 3: myvehicle.co.uk ───────────────────────────────────────────────

async function fetchMyvehicle(plate: string): Promise<SourceResult | null> {
  try {
    const url = `https://myvehicle.co.uk/${plate}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://myvehicle.co.uk/',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    if (html.length < 500) return null;

    const result: SourceResult = { source: 'myvehicle.co.uk' };
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const tr of trMatches) {
      const cellMatches = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [];
      if (cellMatches.length < 2) continue;
      const label = cleanText(cellMatches[0]).toLowerCase();
      const value = cleanText(cellMatches[cellMatches.length - 1]);
      if (!label || !value || value.toLowerCase() === 'n/a' || value === '-') continue;

      if (label.includes('make')) result.make = normaliseMake(value);
      else if (label.includes('model')) result.model = normaliseModel(value.toUpperCase());
      else if (label.includes('colour')) result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label.includes('fuel')) result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      else if (label.includes('year')) { const y = value.match(/\d{4}/); if (y) result.year = parseInt(y[0], 10); }
      else if (label.includes('engine')) result.engineCapacity = parseEngineCc(value);
      else if (label.includes('gearbox') || label.includes('transmission')) { const tx = value.replace(/^[-–\s]+/, '').trim(); if (tx) result.transmission = tx.charAt(0).toUpperCase() + tx.slice(1).toLowerCase(); }
      else if (label.includes('body')) result.bodyType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    // Also try dl/dt/dd pattern
    if (!result.make) {
      const dlMatches = html.match(/<dl[\s\S]*?<\/dl>/gi) ?? [];
      for (const dl of dlMatches) {
        const dts = [...dl.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/gi)].map(m => cleanText(m[1]).toLowerCase());
        const dds = [...dl.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/gi)].map(m => cleanText(m[1]));
        for (let i = 0; i < dts.length && i < dds.length; i++) {
          const label = dts[i]; const value = dds[i];
          if (!value || value.toLowerCase() === 'n/a') continue;
          if (label.includes('make')) result.make = normaliseMake(value);
          else if (label.includes('model')) result.model = normaliseModel(value.toUpperCase());
          else if (label.includes('colour')) result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          else if (label.includes('fuel')) result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          else if (label.includes('year')) { const y = value.match(/\d{4}/); if (y) result.year = parseInt(y[0], 10); }
          else if (label.includes('engine')) result.engineCapacity = parseEngineCc(value);
        }
      }
    }

    return result.make ? result : null;
  } catch {
    return null;
  }
}

// ─── Source 4: motorcheck.co.uk ──────────────────────────────────────────────

async function fetchMotorcheck(plate: string): Promise<SourceResult | null> {
  try {
    const url = `https://www.motorcheck.co.uk/free-car-check/${plate}/`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Referer': 'https://www.motorcheck.co.uk/',
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    if (html.length < 500 || html.includes('cf-browser-verification')) return null;

    const result: SourceResult = { source: 'motorcheck.co.uk' };

    // motorcheck uses definition lists heavily
    const dlMatches = html.match(/<dl[\s\S]*?<\/dl>/gi) ?? [];
    for (const dl of dlMatches) {
      const dts = [...dl.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>/gi)].map(m => cleanText(m[1]).toLowerCase());
      const dds = [...dl.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/gi)].map(m => cleanText(m[1]));
      for (let i = 0; i < dts.length && i < dds.length; i++) {
        const label = dts[i]; const value = dds[i];
        if (!value || value.toLowerCase() === 'n/a' || value === '-') continue;
        if (label.includes('make')) result.make = normaliseMake(value);
        else if (label.includes('model')) result.model = normaliseModel(value.toUpperCase());
        else if (label.includes('colour')) result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        else if (label.includes('fuel')) result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        else if (label.includes('year') || label.includes('manufactured')) { const y = value.match(/\d{4}/); if (y) result.year = parseInt(y[0], 10); }
        else if (label.includes('engine')) result.engineCapacity = parseEngineCc(value);
        else if (label.includes('gearbox') || label.includes('transmission')) { const tx = value.replace(/^[-–\s]+/, '').trim(); if (tx) result.transmission = tx.charAt(0).toUpperCase() + tx.slice(1).toLowerCase(); }
        else if (label.includes('body')) result.bodyType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      }
    }

    // Also try table rows
    if (!result.make) {
      const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
      for (const tr of trMatches) {
        const cellMatches = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [];
        if (cellMatches.length < 2) continue;
        const label = cleanText(cellMatches[0]).toLowerCase();
        const value = cleanText(cellMatches[cellMatches.length - 1]);
        if (!label || !value || value.toLowerCase() === 'n/a') continue;
        if (label.includes('make')) result.make = normaliseMake(value);
        else if (label.includes('model')) result.model = normaliseModel(value.toUpperCase());
      }
    }

    return result.make ? result : null;
  } catch {
    return null;
  }
}

// ─── Source 5: DVSA MOT History API ─────────────────────────────────────────

async function fetchDvsaMot(plate: string, apiKey: string): Promise<SourceResult | null> {
  if (!apiKey) return null;
  try {
    const url = `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${plate}`;
    const res = await fetch(url, {
      headers: { 'x-api-key': apiKey, 'Accept': 'application/json+v6' },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    return {
      make: d.make ? normaliseMake(d.make) : undefined,
      model: d.model ? normaliseModel(d.model.toUpperCase()) : undefined,
      colour: d.primaryColour ? d.primaryColour.charAt(0).toUpperCase() + d.primaryColour.slice(1).toLowerCase() : undefined,
      fuelType: d.fuelType ? d.fuelType.charAt(0).toUpperCase() + d.fuelType.slice(1).toLowerCase() : undefined,
      year: d.manufactureYear,
      engineCapacity: d.cylinderCapacity,
      source: 'DVSA MOT History API',
    };
  } catch {
    return null;
  }
}

// ─── Merge ───────────────────────────────────────────────────────────────────
// Priority: DVSA MOT > carcheck > myvehicle > motorcheck > DVLA VES

function merge(results: (SourceResult | null)[]): SourceResult & { sources: string[]; confidence: string } {
  const valid = results.filter(Boolean) as SourceResult[];

  const priority = [
    'DVSA MOT History API',
    'carcheck.co.uk',
    'myvehicle.co.uk',
    'motorcheck.co.uk',
    'DVLA VES API',
  ];
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
  const hasMake = Boolean(merged.make);
  const hasModel = Boolean(merged.model);
  const n = sorted.length;
  const reliableSources = ['carcheck.co.uk', 'DVSA MOT History API', 'myvehicle.co.uk', 'motorcheck.co.uk'];
  const usedReliable = sources.some(s => reliableSources.includes(s));

  let confidence: string;
  if (hasMake && hasModel && (n >= 2 || usedReliable)) confidence = 'HIGH';
  else if (hasMake && hasModel) confidence = 'MEDIUM';
  else if (hasMake) confidence = 'LOW';
  else confidence = 'VERY LOW';

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
    const dvlaKey = process.env.DVLA_API_KEY ?? '4JQVcz4V9m9ymInn22ThJ42t3ePusqHh3PJ38z8i';
    const dvsaKey = process.env.DVSA_API_KEY ?? '';

    // Run all sources concurrently
    const settled = await Promise.allSettled([
      fetchDvlaVes(plate, dvlaKey),
      fetchCarcheck(plate),
      fetchMyvehicle(plate),
      fetchMotorcheck(plate),
      fetchDvsaMot(plate, dvsaKey),
    ]);

    const results = settled.map(r => r.status === 'fulfilled' ? r.value : null);
    const merged = merge(results);

    if (!merged.make) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    return res.status(200).json({
      make: merged.make,
      model: merged.model ?? null,
      colour: merged.colour ?? null,
      fuelType: merged.fuelType ?? null,
      yearOfManufacture: merged.year ?? null,
      engineCapacity: merged.engineCapacity ?? null,
      taxStatus: merged.taxStatus ?? null,
      motStatus: merged.motStatus ?? null,
      co2Emissions: merged.co2Emissions ?? null,
      transmission: merged.transmission ?? null,
      bodyType: merged.bodyType ?? null,
      doors: merged.doors ?? null,
      confidence: merged.confidence,
      sources: merged.sources,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
}
