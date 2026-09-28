import { useEffect, useState } from 'react';
import { MEDIA_CATEGORIES } from '../lib/mediaApi';
import { Reveal, SectionHeading } from './ui';

function MediaCard({ item }) {
  const url = item.url;
  const isImage = item.mime_type?.startsWith('image/');
  const category = MEDIA_CATEGORIES.find(entry => entry.value === item.category)?.label ?? 'Research material';

  return (
    <article className="media-card">
      <a className={`media-preview ${isImage ? 'media-preview-image' : 'media-preview-pdf'}`} href={url} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`}>
        {isImage ? <img src={url} alt={item.description || item.title} loading="lazy" /> : <span className="pdf-mark" aria-hidden="true">PDF</span>}
        <span className="media-open">↗</span>
      </a>
      <div className="media-card-body">
        <span className="media-category">{category}</span>
        <h3>{item.title}</h3>
        {item.description && <p>{item.description}</p>}
        <a className="media-download" href={url} target="_blank" rel="noreferrer">{isImage ? 'View image' : 'View document'} <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  );
}

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredItems = activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory);

  useEffect(() => {
    let active = true;
    async function loadMedia() {
      let response;
      try {
        response = await fetch('/api/media', { cache: 'no-store' });
        if (response.status === 503) {
          if (active) setConfigured(false);
          return;
        }
        if (!response.ok) throw new Error('Could not load media.');
        const data = await response.json();
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError('Media library is temporarily unavailable.');
      }
      if (!active) return;
      setLoading(false);
    }
    loadMedia();
    return () => { active = false; };
  }, []);

  return (
    <section id="library" className="section-pad section-mist media-library">
      <div className="page-width">
        <SectionHeading eyebrow="05 / RESEARCH LIBRARY" title="Posters, visuals & resources" subtitle="A growing collection of public research materials and educational visuals. Patient-identifiable information is never published here." />
        {loading ? <p className="library-status" role="status">Loading research materials…</p>
          : !configured ? <div className="library-notice"><span className="notice-icon">✳</span><div><strong>Research materials will appear here.</strong><p>Connect a Vercel Blob store and deploy the project source to enable public browsing.</p></div></div>
          : error ? <p className="library-status library-error" role="alert">{error}</p>
            : items.length ? <>
              <div className="media-filters" role="group" aria-label="Filter research library">
                <button type="button" className={activeCategory === 'all' ? 'media-filter active' : 'media-filter'} onClick={() => setActiveCategory('all')}>All materials <span>{items.length}</span></button>
                {MEDIA_CATEGORIES.map(option => <button type="button" key={option.value} className={activeCategory === option.value ? 'media-filter active' : 'media-filter'} onClick={() => setActiveCategory(option.value)}>{option.label}</button>)}
              </div>
              {filteredItems.length ? <div className="media-grid">{filteredItems.map(item => <Reveal key={item.id}><MediaCard item={item} /></Reveal>)}</div> : <div className="library-empty library-empty-compact"><p>No material has been published in this section yet.</p></div>}
            </>
              : <div className="library-empty"><span aria-hidden="true">▧</span><h3>The library is ready for its first upload</h3><p>Published posters, research PDFs and approved educational images will be displayed here.</p></div>}
      </div>
    </section>
  );
}