import { head } from '@vercel/blob';
import { hasAdminSession, isMediaServiceConfigured } from '../server/adminAuth.js';
import { addPublishedMedia, listPublishedMedia, removePublishedMedia } from '../server/mediaCatalog.js';

const noStore = { 'Cache-Control': 'no-store' };
const validCategories = ['research', 'clinical', 'profile'];
const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export async function GET() {
  if (!isMediaServiceConfigured()) return Response.json({ error: 'Media library is not configured.' }, { status: 503, headers: noStore });
  try {
    return Response.json(await listPublishedMedia(), { headers: noStore });
  } catch {
    return Response.json({ error: 'Could not load the research library.' }, { status: 503, headers: noStore });
  }
}

export async function DELETE(request) {
  if (!isMediaServiceConfigured()) return Response.json({ error: 'Media library is not configured.' }, { status: 503 });
  if (!hasAdminSession(request)) return Response.json({ error: 'Sign in as the media administrator.' }, { status: 401 });

  try {
    const { id } = await request.json();
    if (typeof id !== 'string' || !id.startsWith('media/')) return Response.json({ error: 'Invalid media item.' }, { status: 400 });
    const removed = await removePublishedMedia(id);
    return removed
      ? Response.json({ removed: true })
      : Response.json({ error: 'That media item was not found.' }, { status: 404 });
  } catch {
    return Response.json({ error: 'Could not remove this media item.' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isMediaServiceConfigured()) return Response.json({ error: 'Media library is not configured.' }, { status: 503 });
  if (!hasAdminSession(request)) return Response.json({ error: 'Sign in as the media administrator.' }, { status: 401 });

  try {
    const { id, title, description, category, contentType } = await request.json();
    if (typeof id !== 'string' || !id.startsWith('media/')) return Response.json({ error: 'Invalid uploaded file.' }, { status: 400 });
    if (typeof title !== 'string' || !title.trim() || title.length > 120) return Response.json({ error: 'Add a valid title.' }, { status: 400 });
    if (typeof description !== 'string' || description.length > 400) return Response.json({ error: 'Description must be 400 characters or fewer.' }, { status: 400 });
    if (!validCategories.includes(category) || !validTypes.includes(contentType)) return Response.json({ error: 'Invalid media section or file type.' }, { status: 400 });

    const blob = await head(id, { access: 'public' });
    if (blob.contentType !== contentType) return Response.json({ error: 'Uploaded file type did not match.' }, { status: 400 });
    const item = {
      id: blob.pathname,
      title: title.trim(),
      description: description.trim() || null,
      category,
      url: blob.url,
      storage_path: blob.pathname,
      mime_type: blob.contentType,
      created_at: blob.uploadedAt.toISOString(),
    };
    await addPublishedMedia(item);
    return Response.json(item, { headers: noStore });
  } catch {
    return Response.json({ error: 'Could not publish this uploaded file.' }, { status: 500 });
  }
}