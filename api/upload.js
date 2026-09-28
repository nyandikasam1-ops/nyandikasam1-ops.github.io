import { handleUpload } from '@vercel/blob/client';
import { hasAdminSession, isMediaServiceConfigured } from '../server/adminAuth.js';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const VALID_CATEGORIES = ['research', 'clinical', 'profile'];

export async function POST(request) {
  if (!isMediaServiceConfigured()) return Response.json({ error: 'Media storage is not configured.' }, { status: 503 });

  try {
    const body = await request.json();
    const response = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!hasAdminSession(request)) throw new Error('Sign in as the media administrator before uploading.');
        if (!pathname.startsWith('media/')) throw new Error('Invalid upload path.');

        const metadata = JSON.parse(clientPayload ?? '{}');
        if (typeof metadata.title !== 'string' || !metadata.title.trim() || metadata.title.length > 120) throw new Error('Add a valid title for this material.');
        if (typeof metadata.description !== 'string' || metadata.description.length > 400) throw new Error('Description must be 400 characters or fewer.');
        if (!VALID_CATEGORIES.includes(metadata.category)) throw new Error('Choose a valid library section.');
        if (!ACCEPTED_TYPES.includes(metadata.contentType)) throw new Error('Use a PDF, JPEG, PNG or WebP file.');

        return {
          allowedContentTypes: ACCEPTED_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({
            title: metadata.title.trim(),
            description: metadata.description.trim(),
            category: metadata.category,
            contentType: metadata.contentType,
          }),
        };
      },
      onUploadCompleted: async () => {},
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Upload could not be started.' }, { status: 400 });
  }
}