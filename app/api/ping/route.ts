export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return new Response('pong', { 
    status: 200, 
    headers: { 'content-type': 'text/plain' } 
  });
}
