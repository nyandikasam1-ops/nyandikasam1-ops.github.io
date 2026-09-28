import { useEffect, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { MAX_UPLOAD_BYTES, MEDIA_CATEGORIES } from '../lib/mediaApi';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export default function MediaAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('research');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/session', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json();
        if (!active) return;
        if (!response.ok || !data.configured) setConfigured(false);
        else setAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => { if (active) setConfigured(false); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  async function refreshItems() {
    const response = await fetch('/api/media', { cache: 'no-store' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? 'Could not load the research library.');
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (!authenticated) return undefined;
    let active = true;
    refreshItems().catch(loadError => { if (active) setError(loadError.message); });
    return () => { active = false; };
  }, [authenticated]);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Sign in failed.');
      setPassword('');
      setAuthenticated(true);
    } catch (signInError) {
      setError(signInError.message);
    }
    setBusy(false);
  }

  async function uploadMedia(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!file) return setError('Choose an image or PDF first.');
    if (!ACCEPTED_TYPES.includes(file.type)) return setError('Use a PDF, JPEG, PNG or WebP file.');
    if (file.size > MAX_UPLOAD_BYTES) return setError('Files must be 10 MB or smaller.');
    if (!title.trim()) return setError('Add a title for this material.');

    setBusy(true);
    const extension = file.name.split('.').pop()?.toLowerCase();
    const pathname = `media/${crypto.randomUUID()}.${extension}`;
    try {
      const blob = await upload(pathname, file, {
        access: 'public',
        contentType: file.type,
        handleUploadUrl: '/api/upload',
        clientPayload: JSON.stringify({ title: title.trim(), description: description.trim(), category, contentType: file.type }),
      });
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blob.pathname, title: title.trim(), description: description.trim(), category, contentType: file.type }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'The file uploaded, but could not be published to the library.');
      setTitle('');
      setDescription('');
      setFile(null);
      event.target.reset();
      setMessage('Published. It is now visible in the public research library.');
      await refreshItems();
    } catch (uploadError) {
      setError(uploadError.message);
    }
    setBusy(false);
  }

  async function removeMedia(item) {
    if (!window.confirm(`Remove “${item.title}” from the public library?`)) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not delete this item.');
      await refreshItems();
    } catch (deleteError) {
      setError(deleteError.message);
    }
    setBusy(false);
  }

  async function signOut() {
    await fetch('/api/session', { method: 'DELETE' });
    setItems([]);
    setAuthenticated(false);
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar"><a className="brand" href="/"><span className="brand-mark">SO</span><span>Samson <b>Orina</b></span></a><a className="admin-back" href="/">← Back to public website</a></header>
      <div className="admin-content">
        <div className="admin-heading"><p className="eyebrow">PRIVATE MEDIA WORKSPACE</p><h1>Research library<br /><em>management</em></h1><p>Publish approved images and PDFs to the public website library.</p></div>
        {!configured ? <div className="admin-notice"><h2>Connect Vercel Blob</h2><p>Create a Blob store in this Vercel project and set <strong>MEDIA_ADMIN_PASSWORD</strong> in Environment Variables. Deploy from the project source so its protected API routes are active. See the README setup guide.</p></div>
          : authLoading ? <p role="status">Checking your session…</p>
            : !authenticated ? <form className="admin-panel sign-in-panel" onSubmit={signIn}><span className="admin-icon">♙</span><h2>Administrator sign in</h2><p>Use the private media-manager password configured in your Vercel project settings.</p><label>Admin password<input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></label><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in securely'} <span>→</span></button></form>
              : <>
                <div className="admin-toolbar"><span><strong>Administrator session active</strong> · closes automatically after eight hours</span><button type="button" className="sign-out-button" onClick={signOut}>Sign out</button></div>
                <div className="admin-columns">
                  <form className="admin-panel upload-panel" onSubmit={uploadMedia}><div className="panel-heading"><span className="admin-icon">↑</span><div><h2>Publish new material</h2><p>PDF or image · up to 10 MB</p></div></div>
                    <label className="drop-zone"><input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={event => setFile(event.target.files?.[0] ?? null)} required /><span className="upload-glyph">⇧</span><strong>{file ? file.name : 'Choose a file to upload'}</strong><small>PDF, JPG, PNG or WebP</small></label>
                    <label>Public title<input value={title} onChange={event => setTitle(event.target.value)} maxLength={120} placeholder="e.g. KICC 2026 research poster" required /></label>
                    <label>Description <span className="optional-label">optional</span><textarea value={description} onChange={event => setDescription(event.target.value)} rows="3" maxLength={400} placeholder="A short, accessible description for visitors" /></label>
                    <label>Website section<select value={category} onChange={event => setCategory(event.target.value)}>{MEDIA_CATEGORIES.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
                    <p className="privacy-reminder">Only upload material you have permission to publish. Do not upload patient records, faces, names or other identifying health information.</p>
                    <button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Publish to website'} <span>↗</span></button>
                  </form>
                  <section className="admin-panel inventory-panel"><div className="panel-heading"><span className="admin-icon admin-icon-muted">▤</span><div><h2>Published items</h2><p>{items.length} {items.length === 1 ? 'item' : 'items'} in the public library</p></div></div>
                    {items.length ? <div className="inventory-list">{items.map(item => <article className="inventory-item" key={item.id}><span className="inventory-file">{item.mime_type === 'application/pdf' ? 'PDF' : 'IMG'}</span><div className="inventory-info"><strong>{item.title}</strong><span>{MEDIA_CATEGORIES.find(entry => entry.value === item.category)?.label}</span></div><a href={item.url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`}>↗</a><button type="button" onClick={() => removeMedia(item)} disabled={busy} aria-label={`Delete ${item.title}`}>×</button></article>)}</div> : <div className="inventory-empty">Your published files will be listed here.</div>}
                  </section>
                </div>
              </>}
        {error && <p className="form-message form-error" role="alert">{error}</p>}{message && <p className="form-message form-success" role="status">{message}</p>}
        <p className="admin-footnote">Uploads are sent directly to Vercel Blob. Published items are public; admin access uses a secure, short-lived, HttpOnly session cookie.</p>
      </div>
    </main>
  );
}