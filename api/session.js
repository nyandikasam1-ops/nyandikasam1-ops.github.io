import { createSessionToken, clearSessionCookie, isMediaServiceConfigured, passwordMatches, sessionCookie, hasAdminSession } from '../server/adminAuth.js';

export async function GET(request) {
  if (!isMediaServiceConfigured()) {
    return Response.json({ configured: false, authenticated: false }, { status: 503 });
  }
  return Response.json({ configured: true, authenticated: hasAdminSession(request) });
}

export async function POST(request) {
  if (!isMediaServiceConfigured()) {
    return Response.json({ error: 'Connect a Vercel Blob store and set the media admin password.' }, { status: 503 });
  }

  try {
    const { password } = await request.json();
    if (!passwordMatches(password)) return Response.json({ error: 'Incorrect admin password.' }, { status: 401 });
    return Response.json({ authenticated: true }, { headers: { 'Set-Cookie': sessionCookie(createSessionToken()) } });
  } catch {
    return Response.json({ error: 'Could not sign in. Try again.' }, { status: 400 });
  }
}

export async function DELETE() {
  return Response.json({ authenticated: false }, { headers: { 'Set-Cookie': clearSessionCookie() } });
}