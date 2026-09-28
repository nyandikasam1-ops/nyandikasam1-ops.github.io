import { researchMeta } from '../data/researchData';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div><p className="footer-brand">Samson Orina <span>· KICC 2026</span></p><p>Neutropenia research · Abstract No. {researchMeta.abstractNumber}</p></div>
        <p>© 2026 {researchMeta.author}<br />{researchMeta.institution}</p>
        <div className="footer-actions"><a href="/admin">Media manager ↗</a><a href="#top">Back to top ↑</a></div>
      </div>
      <p className="footer-hashtag">#KICC2026 · @KESHO</p>
    </footer>
  );
}
