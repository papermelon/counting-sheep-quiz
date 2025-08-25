import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  
  if (token !== process.env.DEBUG_TOKEN) {
    return new Response('Unauthorized', { 
      status: 401, 
      headers: { 'content-type': 'text/plain' } 
    });
  }

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // Raw connectivity probe
  let probe: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    });
    probe.ok = r.ok;
    probe.status = r.status;
  } catch (e: any) {
    probe.error = String(e?.message || e);
  }

  // Supabase client query
  const supabase = createClient(supabaseUrl, anon);
  const { data, error } = await supabase.from('quizzes').select('slug,max_score').limit(3);

  return new Response(
    JSON.stringify({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? null,
      appName: process.env.NEXT_PUBLIC_APP_NAME ?? null,
      supabaseUrl,
      anonKeyPresent: !!anon,
      serviceRolePresent: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      probe,
      dbOk: !error,
      error: error?.message ?? null,
      sample: data ?? [],
    }),
    { headers: { 'content-type': 'application/json; charset=utf-8' } }
  );
}
