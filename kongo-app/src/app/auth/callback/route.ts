import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/auth-server';



export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get('code');
  const hash = params.get('token_hash');
  const type = params.get('type');
  const destination = params.get('next') === '/nouveau-mot-de-passe' || type === 'recovery'
    ? '/nouveau-mot-de-passe' : '/espace-membre';
  const supabase = await createClient();
  let success = false;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    success = !error;
  } else if (hash && (type === 'email' || type === 'recovery')) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: hash, type });
    success = !error;
  }
  const response = NextResponse.redirect(new URL(success ? destination : '/auth/erreur', request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
