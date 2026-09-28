import { del, get, put } from '@vercel/blob';

const CATALOG_PATH = 'site-media-catalog.json';

async function readCatalog() {
  const catalogBlob = await get(CATALOG_PATH, { access: 'public', useCache: false });
  if (!catalogBlob?.stream) return [];
  const items = await new Response(catalogBlob.stream).json();
  return Array.isArray(items) ? items : [];
}

async function writeCatalog(items) {
  await put(CATALOG_PATH, JSON.stringify(items), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}

export async function listPublishedMedia() {
  const items = await readCatalog();
  return items.sort((first, second) => new Date(second.created_at) - new Date(first.created_at));
}

export async function addPublishedMedia(item) {
  const items = await readCatalog();
  const withoutDuplicate = items.filter(existing => existing.id !== item.id);
  await writeCatalog([item, ...withoutDuplicate]);
}

export async function removePublishedMedia(id) {
  const items = await readCatalog();
  const item = items.find(entry => entry.id === id);
  if (!item) return false;

  const remaining = items.filter(entry => entry.id !== id);
  await writeCatalog(remaining);
  await del(item.url);
  return true;
}