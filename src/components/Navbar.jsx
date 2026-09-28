import { useState } from 'react';

const links = [
  ['Abstract', '#abstract'], ['Background', '#background'], ['Methods', '#methods'],
  ['Results', '#results'], ['Library', '#library'], ['Recommendations', '#recommendations'], ['Author', '#author'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <a className="brand" href="#top" aria-label="Samson Nyandika Orina home"><span className="brand-mark">SO</span><span>Samson <b>Orina</b></span></a>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav id="primary-navigation" className={`nav-links ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
        <a className="nav-badge" href="#conference">KICC <span>2026</span></a>
      </div>
    </header>
  );
}
