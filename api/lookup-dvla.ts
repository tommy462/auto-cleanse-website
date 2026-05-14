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
  // "1.499 cc" or "1,499 cc" form
  let m = t.match(/(\d+\.\d+)\s*cc/);
  if (m) {
    const val = parseFloat(m[1]);
    return Math.round(val < 100 ? val * 1000 : val);
  }
  // plain integer cc: "1499 cc"
  m = t.match(/(\d{3,4})\s*cc/);
  if (m) return parseInt(m[1], 10);
  // litre form: "1.6 litre"
  m = t.match(/(\d+\.\d+)\s*(?:l|litre)/);
  if (m) return Math.round(parseFloat(m[1]) * 1000);
  return undefined;
}

function normaliseMake(make: string): string {
  const MAP: Record<string, string> = {
    VW: 'Volkswagen', VOLKSWAGEN: 'Volkswagen', BMW: 'BMW',
    MERCEDES: 'Mercedes-Benz', 'MERCEDES-BENZ': 'Mercedes-Benz',
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
  };
  const upper = make.trim().toUpperCase();
  return MAP[upper] ?? make.trim().replace(/\b\w/g, c => c.toUpperCase());
}

function normaliseModel(model: string): string {
  if (!model) return '';
  // Remove registration plate artefacts
  let m = model.replace(/\b[A-Z]{2}\d{2}[A-Z]{3}\b/g, '').trim();
  // Deduplicate adjacent words: "SPRINTER SPRINTER 314" → "SPRINTER 314"
  const words = m.toUpperCase().split(/\s+/);
  const deduped: string[] = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (words[i] !== words[i - 1]) deduped.push(words[i]);
  }
  return deduped.join(' ');
}

// ─── Source 1: DVLA VES API ──────────────────────────────────────────────────
// Gives: make, colour, fuel, year, engine CC — but NOT model

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
// Gives: make, model (FULL trim), year, engine, fuel, colour, gearbox, doors, power, CO2

async function fetchCarcheck(plate: string): Promise<SourceResult | null> {
  try {
    const url = `https://www.carcheck.co.uk/numberplate/${plate}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.9',
        'DNT': '1',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const result: SourceResult = { source: 'carcheck.co.uk' };

    // Extract all <tr> blocks from the page
    const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const tr of trMatches) {
      // Extract all td/th cell contents from this row
      const cellMatches = tr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? [];
      if (cellMatches.length < 2) continue;

      const label = cleanText(cellMatches[0]).toLowerCase();
      const value = cleanText(cellMatches[cellMatches.length - 1]);

      if (!label || !value || /^[?\s]+$/.test(value)) continue;
      if (value.toLowerCase() === 'n/a' || value === '-' || value === '–') continue;

      if (label === 'make') {
        result.make = normaliseMake(value);
      } else if (label === 'model') {
        result.model = normaliseModel(value);
      } else if (label === 'colour') {
        result.colour = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      } else if (label === 'fuel type') {
        result.fuelType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      } else if (label === 'year of manufacture') {
        const y = value.match(/\d{4}/);
        if (y) result.year = parseInt(y[0], 10);
      } else if (label === 'engine capacity') {
        result.engineCapacity = parseEngineCc(value);
      } else if (label === 'gearbox') {
        const tx = value.replace(/^[-–\s]+/, '').trim();
        if (tx) result.transmission = tx.charAt(0).toUpperCase() + tx.slice(1).toLowerCase();
      } else if (label === 'body type' || label === 'body style') {
        result.bodyType = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      } else if (label === 'number of doors') {
        result.doors = value;
      }
    }

    return result.make ? result : null;
  } catch {
    return null;
  }
}

// ─── Source 3: DVSA MOT History API ─────────────────────────────────────────
// Gives: make, model, colour, fuel, year, engine — most complete govt source

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
// Priority: DVSA MOT > carcheck > DVLA VES for each field

function merge(results: (SourceResult | null)[]): SourceResult & { sources: string[]; confidence: string } {
  const valid = results.filter(Boolean) as SourceResult[];

  // Source priority order
  const priority = ['DVSA MOT History API', 'carcheck.co.uk', 'DVLA VES API'];
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
  const usedReliable = sources.some(s => ['carcheck.co.uk', 'DVSA MOT History API'].includes(s));

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
    const [dvlaResult, carcheckResult, dvsaResult] = await Promise.allSettled([
      fetchDvlaVes(plate, dvlaKey),
      fetchCarcheck(plate),
      fetchDvsaMot(plate, dvsaKey),
    ]);

    const results = [
      dvlaResult.status === 'fulfilled' ? dvlaResult.value : null,
      carcheckResult.status === 'fulfilled' ? carcheckResult.value : null,
      dvsaResult.status === 'fulfilled' ? dvsaResult.value : null,
    ];

    const merged = merge(results);

    if (!merged.make) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Return in a format compatible with the existing DVLAVehicleData interface
    // plus all the extra fields for richer display
    return res.status(200).json({
      // Original DVLA VES field names (backwards compatibility)
      make: merged.make,
      model: merged.model ?? null,
      colour: merged.colour ?? null,
      fuelType: merged.fuelType ?? null,
      yearOfManufacture: merged.year ?? null,
      engineCapacity: merged.engineCapacity ?? null,
      taxStatus: merged.taxStatus ?? null,
      motStatus: merged.motStatus ?? null,
      co2Emissions: merged.co2Emissions ?? null,
      // Extra fields
      transmission: merged.transmission ?? null,
      bodyType: merged.bodyType ?? null,
      doors: merged.doors ?? null,
      // Metadata
      confidence: merged.confidence,
      sources: merged.sources,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
}
