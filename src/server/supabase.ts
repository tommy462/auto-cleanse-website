// Server-only Supabase REST helper for the AutoCleanse dashboard database.
// Uses the service-role key, so this must never be imported from client code.

const SUPABASE_URL = process.env.AUTOCLEANSE_SUPABASE_URL;
const SUPABASE_KEY = process.env.AUTOCLEANSE_SUPABASE_SERVICE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export async function sb<T = unknown>(
  path: string,
  opts: RequestInit & { prefer?: string } = {},
): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase not configured (AUTOCLEANSE_SUPABASE_URL / AUTOCLEANSE_SUPABASE_SERVICE_KEY)');
  }
  const { prefer, ...rest } = opts;
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...rest,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: prefer ?? 'return=representation',
      ...((rest.headers as Record<string, string> | undefined) ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${path}: ${res.status} ${text}`);
  return (text ? JSON.parse(text) : null) as T;
}
