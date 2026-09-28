import { motion } from 'framer-motion';

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className={`section-heading ${light ? 'text-white' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {subtitle && <p className={`section-subtitle ${light ? 'text-white/70' : ''}`}>{subtitle}</p>}
    </div>
  );
}

export function MetricCard({ value, title, detail, tone = 'teal', index = 0 }) {
  return (
    <Reveal delay={index * 0.05}>
      <article className={`metric-card metric-${tone}`}>
        <span className="metric-value">{value}</span>
        <h3>{title}</h3>
        <p>{detail}</p>
      </article>
    </Reveal>
  );
}

export function ScrollTable({ children, label }) {
  return <div className="table-scroll" role="region" aria-label={label} tabIndex="0">{children}</div>;
}
