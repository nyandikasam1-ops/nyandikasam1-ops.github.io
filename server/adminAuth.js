import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'orina_media_admin';
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;

export function isMediaServiceConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN
    && process.env.MEDIA_ADMIN_PASSWORD
    && process.env.MEDIA_ADMIN_PASSWORD.length >= 20,
  );
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(payload) {
  return createHmac('sha256', process.env.MEDIA_ADMIN_PASSWORD).update(payload).digest('base64url');
}

export function passwordMatches(candidate) {
  const password = process.env.MEDIA_ADMIN_PASSWORD;
  return Boolean(password && typeof candidate === 'string' && safeEqual(candidate, password));
}

export function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({ expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000 })).toString('base64url');
  return `${payload}.${signSession(payload)}`;
}

export function hasAdminSession(request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookie = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`));
  if (!cookie) return false;

  const token = cookie.slice(COOKIE_NAME.length + 1);
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  if (!safeEqual(signature, signSession(payload))) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(session.expiresAt) && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookie(token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict${secure}`;
}

export function clearSessionCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}