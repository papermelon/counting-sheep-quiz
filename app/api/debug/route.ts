import { createClient } from '@supabase/supabase-js';

// Avoid caching and force Node runtime (NOT Edge)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.DEBUG_TOKEN) {
    return new Response('Unauthorized', { status: 401, headers: { 'content-type': 'text/plain' } });
  }

  // sanitize envs
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // 1) low-level probe to PostgREST root to detect URL/network issues
  let probe: { ok: boolean; status?: number; text?: string; error?: string } = { ok: false };
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    });
    probe.ok = r.ok;
    probe.status = r.status;
    probe.text = await r.text();
  } catch (e: any) {
    probe.error = String(e?.message || e);
  }

  // 2) normal client query
  const supabase = createClient(supabaseUrl, anon);
  const { data, error } = await supabase.from('quizzes').select('slug,max_score').limit(3);

  return new Response(
    JSON.stringify({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? null,
      appName: process.env.NEXT_PUBLIC_APP_NAME ?? null,
      supabaseUrl,
      anonKeyPresent: !!anon,
      serviceRolePresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      probe,             // <— shows whether raw fetch worked
      dbOk: !error,
      error: error?.message ?? null,
      sample: data ?? [],
    }),
    { headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}
