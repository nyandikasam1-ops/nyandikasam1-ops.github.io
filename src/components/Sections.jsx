import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue } from 'framer-motion';
import {
  Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  cinByType, comparison, complicationData, keywords, nadirTimeline,
  recommendations, researchMeta, resultStats, riskFactors, stats,
} from '../data/researchData';
import { MetricCard, Reveal, ScrollTable, SectionHeading } from './ui';

function CountUp({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(count, value, { duration: 1.35, ease: 'easeOut' });
    const unsubscribe = count.on('change', current => setShown(Math.round(current)));
    return () => { controls.stop(); unsubscribe(); };
  }, [inView, count, value]);
  return <span ref={ref}>{shown}{suffix}</span>;
}

export function Hero() {
  return (
    <section id="top" className="hero-section">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-inner page-width">
        <Reveal>
          <div className="hero-copy">
            <p className="hero-kicker"><span className="live-dot" /> {researchMeta.author} <span>·</span> KICC 2026 <span>·</span> Poster presentation</p>
            <h1>Neutropenia crisis:<br /><em>how common it is and how it</em><br />delays cancer treatment</h1>
            <p className="hero-subtitle">Research on chemotherapy-induced neutropenia and its impact on cancer treatment at Moi Teaching and Referral Hospital (MTRH), Eldoret.</p>
            <p className="hero-author">Medical Laboratory Sciences<span> · </span>Moi University, Eldoret, Kenya</p>
            <div className="hero-actions"><a className="button button-light" href="#abstract">Explore the study <span aria-hidden="true">↓</span></a><a className="text-link text-link-light" href="#results">Jump to findings <span aria-hidden="true">↗</span></a></div>
            <div id="conference" className="conference-line"><span className="conference-icon" aria-hidden="true">✳</span><span><strong>{researchMeta.conference}</strong><br />{researchMeta.dates} · {researchMeta.venue}<br /><small>Organised by {researchMeta.organiser}</small></span></div>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="hero-art" aria-label="Abstract illustration of blood cell forms">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="cell cell-large"><span /><span /><span /><span /><span /></div>
            <div className="cell cell-small cell-orange"><span /><span /><span /></div>
            <div className="cell cell-tiny"><span /><span /></div>
            <div className="art-caption"><span className="art-caption-mark">ANC</span><span>Absolute neutrophil count<br /><b>Clinical signal. Human story.</b></span></div>
            <div className="art-label">MTRH <span>·</span> ELDORET, KENYA</div>
          </div>
        </Reveal>
      </div>
      <div className="hero-stats page-width">
        {stats.map((item, index) => <motion.div key={item.label} className={`hero-stat hero-stat-${item.tone}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 + index * 0.09 }}>
          <strong><CountUp value={item.value} suffix={item.suffix} /></strong><span>{item.label}</span><small>{item.note}</small>
        </motion.div>)}
      </div>
      <div className="hero-footnote page-width">Research presented at the 9th Kenya International Cancer Conference · Abstract No. {researchMeta.abstractNumber}</div>
    </section>
  );
}

export function Abstract() {
  return (
    <section id="abstract" className="section-pad section-white">
      <div className="page-width">
        <SectionHeading eyebrow="01 / THE STUDY" title="A local question. A patient-level impact." subtitle="Why look at neutropenia—and what this retrospective study set out to understand." />
        <div className="abstract-grid">
          <Reveal><article className="content-card abstract-main"><span className="card-index">01</span><h3>Background</h3><p>Many people receiving chemotherapy develop low neutrophil counts. Neutropenia can increase infection risk and may lead clinicians to delay or modify treatment. At Moi Teaching and Referral Hospital (MTRH), this study provides institution-specific data on the frequency of chemotherapy-induced neutropenia and its impact on care.</p><div className="thin-rule" /><h3>Objective</h3><p className="intro-copy">To describe chemotherapy-induced neutropenia among patients treated at MTRH and examine:</p><ul className="check-list"><li>How often neutropenia was recorded</li><li>Which patient or treatment characteristics were associated with it</li><li>How frequently it coincided with a chemotherapy delay</li></ul></article></Reveal>
          <Reveal delay={0.1}><article className="content-card abstract-keywords"><span className="card-index">02</span><div className="keyword-symbol" aria-hidden="true">⌕</div><h3>Research keywords</h3><p>Terms used to frame this work</p><div className="keyword-list">{keywords.map(word => <span key={word} className="keyword-pill">{word}</span>)}</div><div className="keyword-note"><span>↗</span> Local evidence can help inform locally relevant questions.</div></article></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Background() {
  return (
    <section id="background" className="section-pad section-mist">
      <div className="page-width">
        <SectionHeading eyebrow="02 / CONTEXT" title="Understanding the problem" subtitle="A quick primer on neutrophils, chemotherapy timing and the local care context." />
        <div className="context-grid">
          <Reveal><article className="context-card"><div className="context-icon">◉</div><p className="card-eyebrow">THE BASICS</p><h3>What is neutropenia?</h3><p>A lower-than-expected number of neutrophils, a type of white blood cell involved in fighting infection. This study defines neutropenia as an absolute neutrophil count (ANC) below 1,500 cells/µL.</p><ScrollTable label="ANC severity thresholds"><table><thead><tr><th>Category</th><th>ANC cells/µL</th><th>Clinical significance</th></tr></thead><tbody><tr><td>Mild</td><td>1,000–1,500</td><td>Monitor</td></tr><tr><td>Moderate</td><td>500–999</td><td>Elevated risk</td></tr><tr><td>Severe</td><td>&lt;500</td><td>High risk</td></tr><tr><td>Critical</td><td>&lt;100</td><td>Emergency</td></tr></tbody></table></ScrollTable><p className="micro-note">ANC = absolute neutrophil count. Thresholds are presented for the study context.</p></article></Reveal>
          <Reveal delay={0.08}><article className="context-card"><div className="context-icon context-icon-orange">⌁</div><p className="card-eyebrow">THE TIMING</p><h3>The post-chemo nadir</h3><p>Blood-count patterns depend on the regimen and patient. A nadir is the low point in a count cycle; the timing shown here is a general educational illustration, not a schedule for every regimen.</p><div className="timeline-mini">{nadirTimeline.map((item, index) => <div className="timeline-mini-item" key={item.day}><span className="timeline-day">{item.day}</span><span className="timeline-dot" /><span className="timeline-event">{item.event}</span>{index < nadirTimeline.length - 1 && <span className="timeline-connector" />}</div>)}</div><div className="soft-callout"><strong>Important:</strong> Fever during chemotherapy can require urgent assessment. Follow the treating team's written instructions and local emergency pathway.</div></article></Reveal>
          <Reveal delay={0.16}><article className="context-card context-card-dark"><div className="context-icon context-icon-dark">⌂</div><p className="card-eyebrow">THE SETTING</p><h3>Why MTRH matters</h3><p>Moi Teaching and Referral Hospital is western Kenya's Level 6 national referral hospital, serving more than 15 million people across the North Rift, Western and Nyanza regions. Long travel distances can make urgent return visits difficult, while access to G-CSF and timely laboratory results shapes neutropenia care.</p><div className="context-stat"><strong>Local data</strong><span>can make service gaps—and priorities—more visible.</span></div></article></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Methods() {
  const steps = [
    ['01', 'Study design', 'Retrospective descriptive cross-sectional review of existing records.'],
    ['02', 'Patient selection', '250 adults and children who received chemotherapy at MTRH during 2025. The study included solid tumours and haematological malignancies.'],
    ['03', 'Data collected', 'CBC/ANC results, cancer type, treatment cycles, fever/infection, treatment delays, dose changes, age and performance status.'],
    ['04', 'Definitions', 'Neutropenia: ANC <1,500 cells/µL. Severe neutropenia: ANC <500 cells/µL. Febrile neutropenia: ANC <500 cells/µL with fever >38°C.'],
    ['05', 'Ethics & privacy', 'Approved by Moi University Institutional Research and Ethics Committee (IREC). Patient data were anonymised.'],
  ];
  return (
    <section id="methods" className="section-pad section-white">
      <div className="page-width">
        <SectionHeading eyebrow="03 / APPROACH" title="How the study was done" subtitle="Retrospective descriptive cross-sectional study · MTRH · 2025." />
        <div className="method-track">{steps.map(([number, title, body], index) => <Reveal key={number} delay={index * 0.06}><article className="method-step"><div className="method-marker"><span>{number}</span></div><p className="card-eyebrow">STEP {number}</p><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div>
        <div className="method-foot"><span>Study workflow</span><span>Records → extract → describe → interpret with care</span></div>
      </div>
    </section>
  );
}

const chartTooltip = {
  contentStyle: { border: '1px solid #e5e9e8', borderRadius: 12, boxShadow: '0 12px 30px rgba(20,33,61,.1)' },
  labelStyle: { color: '#14213d', fontWeight: 700 },
};

export function Results() {
  return (
    <section id="results" className="section-pad section-mist">
      <div className="page-width">
        <SectionHeading eyebrow="04 / FINDINGS" title="Key findings" subtitle="Study results from 250 cancer patients treated with chemotherapy at MTRH." />
        <div className="result-stats-grid">{resultStats.map((item, index) => <MetricCard key={item.title} {...item} index={index} />)}</div>
        <div className="charts-grid">
          <Reveal><article className="chart-card"><div className="chart-card-heading"><div><p className="card-eyebrow">PREVALENCE</p><h3>CIN rate by cancer type</h3></div><span className="chart-unit">Percent</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={cinByType} margin={{ top: 14, right: 12, left: -12, bottom: 4 }}><CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9eeed" /><XAxis dataKey="type" tick={{ fill: '#65716f', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 50]} tick={{ fill: '#65716f', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={value => `${value}%`} /><Tooltip {...chartTooltip} formatter={value => [`${value}%`, 'CIN rate']} /><ReferenceLine y={27} stroke="#14213d" strokeDasharray="5 5" label={{ value: 'Overall 27%', position: 'insideTopRight', fill: '#14213d', fontSize: 11 }} /><Bar dataKey="rate" radius={[7, 7, 0, 0]} maxBarSize={58}>{cinByType.map((entry, index) => <Cell key={entry.type} fill={['#0d7377', '#e07b39', '#14213d'][index]} />)}</Bar></BarChart></ResponsiveContainer></div><p className="chart-caption">Haematological malignancies had a 38% CIN rate, compared with 18% among solid tumours.</p></article></Reveal>
          <Reveal delay={0.1}><article className="chart-card"><div className="chart-card-heading"><div><p className="card-eyebrow">COMPLICATIONS</p><h3>Among neutropenic patients</h3></div><span className="chart-unit">n = 68</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={complicationData} layout="vertical" margin={{ top: 5, right: 20, left: 12, bottom: 5 }}><CartesianGrid strokeDasharray="3 5" horizontal={false} stroke="#e9eeed" /><XAxis type="number" domain={[0, 70]} tick={{ fill: '#65716f', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={value => `${value}%`} /><YAxis type="category" dataKey="name" width={150} tick={{ fill: '#65716f', fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip {...chartTooltip} formatter={value => [`${value}%`, 'Share']} /><Bar dataKey="value" radius={[0, 7, 7, 0]} maxBarSize={30}>{complicationData.map(entry => <Cell key={entry.name} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer></div><p className="chart-caption">Among patients with CIN, 22% developed febrile neutropenia and 60% experienced a chemotherapy delay.</p></article></Reveal>
        </div>
        <div className="table-card result-table-card"><div className="table-title"><div><p className="card-eyebrow">RISK FACTORS</p><h3>Who is most at risk?</h3></div></div><ScrollTable label="Reported risk factors"><table><thead><tr><th>Risk factor</th><th>Finding</th><th>Why</th></tr></thead><tbody>{riskFactors.map(row => <tr key={row.factor}><td><strong>{row.factor}</strong></td><td>{row.finding}</td><td>{row.reason}</td></tr>)}</tbody></table></ScrollTable></div>
      </div>
    </section>
  );
}

export function Discussion() {
  return (
    <section id="discussion" className="section-pad section-white">
      <div className="page-width">
        <SectionHeading eyebrow="05 / INTERPRETATION" title="Putting the findings in context" subtitle="What the MTRH results mean for cancer care in western Kenya." />
        <div className="discussion-grid">
          <Reveal><article className="discussion-card"><p className="card-eyebrow">COMPARATIVE CONTEXT</p><h3>How does MTRH compare?</h3><p className="discussion-intro">The MTRH findings sit within reported international and regional ranges, while treatment delays underline the importance of locally workable supportive-care pathways.</p><ScrollTable label="Comparison of neutropenia outcomes"><table><thead><tr><th>Parameter</th><th>MTRH</th><th>High-income settings</th><th>Sub-Saharan Africa</th></tr></thead><tbody>{comparison.map(row => <tr key={row.param}><td>{row.param}</td><td><strong>{row.mtrh}</strong></td><td>{row.hic}</td><td>{row.ssa}</td></tr>)}</tbody></table></ScrollTable></article></Reveal>
          <Reveal delay={0.1}><article className="discussion-card discussion-card-ink"><p className="card-eyebrow">WHY IT MATTERS</p><h3>Treatment continuity is part of care.</h3><p>A seven-day chemotherapy delay means an additional week without scheduled treatment. Repeated delays can reduce relative dose intensity, an important measure in treatment planning and outcomes.</p><p>At MTRH, the findings highlight the need to identify neutropenia early, prevent avoidable complications and support timely, safe continuation of cancer treatment.</p><div className="warning-box"><span aria-hidden="true">!</span><p><strong>Recognise febrile neutropenia</strong><br />Fever above 38°C during chemotherapy is a medical emergency. Patients should seek urgent assessment and follow the MTRH oncology team's care instructions.</p></div></article></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Recommendations() {
  return (
    <section id="recommendations" className="section-pad section-mist">
      <div className="page-width">
        <SectionHeading eyebrow="06 / NEXT STEPS" title="From evidence to action" subtitle="Potential service improvements to review with MTRH oncology, laboratory and pharmacy teams." />
        <div className="recommendation-grid">{recommendations.map((item, index) => <Reveal key={item.title} delay={index * 0.06}><article className="recommendation-card"><div className="recommendation-top"><span className="recommendation-icon">{item.icon}</span><span className="recommendation-number">0{index + 1}</span></div><h3>{item.title}</h3><p>{item.body}</p><span className="recommendation-tag">{item.tag}</span></article></Reveal>)}</div>
      </div>
    </section>
  );
}

export function Conclusion() {
  return (
    <section className="conclusion-section">
      <div className="conclusion-orbit" aria-hidden="true" />
      <div className="page-width conclusion-inner">
        <SectionHeading eyebrow="07 / TAKE-HOME MESSAGE" title="Local evidence. Better-informed cancer care." subtitle="Findings from Moi Teaching and Referral Hospital, Eldoret." light />
        <Reveal><blockquote>“Neutropenia is disrupting cancer treatment for one in four patients at MTRH. Systematic monitoring, preventive care and institutional protocols can help address this challenge.”</blockquote></Reveal>
        <Reveal delay={0.08}><p className="conclusion-copy">This study documents chemotherapy-induced neutropenia at Moi Teaching and Referral Hospital, Eldoret. CIN affected 27% of patients, with a higher rate among patients with blood cancers (38%) than solid tumours (18%). Febrile neutropenia affected 22% of neutropenic patients, and 60% experienced treatment delays averaging seven days. The findings support routine blood-count monitoring, risk-based G-CSF prophylaxis, patient education and a locally tailored institutional protocol. Patients in western Kenya deserve cancer-care standards informed by evidence from their own communities.</p></Reveal>
        <a className="button button-outline-light" href="#author">Meet the researcher <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}

export function Author() {
  return (
    <section id="author" className="section-pad section-white">
      <div className="page-width">
        <SectionHeading eyebrow="08 / AUTHOR" title="About the researcher" subtitle="Cancer research grounded in patient care and local evidence." />
        <Reveal><article className="author-card"><div className="author-monogram" aria-hidden="true">SO<span>✳</span></div><div className="author-content"><p className="card-eyebrow">MEDICAL LABORATORY SCIENCES</p><h3>{researchMeta.author}</h3><div className="author-meta"><span>⌂ {researchMeta.institution}</span><span>◎ {researchMeta.programme}</span></div><p>Samson Nyandika Orina is a Medical Laboratory Sciences student at Moi University. His research focuses on neutropenia and continuity of cancer treatment in western Kenya. This study was accepted for poster presentation at the 9th Kenya International Cancer Conference (KICC 2026).</p><div className="author-links"><a className="author-email" href={`mailto:${researchMeta.email}`}>✉ Email Samson <span aria-hidden="true">↗</span></a><a className="author-email" href={researchMeta.linkedin} target="_blank" rel="noopener noreferrer">in LinkedIn profile <span aria-hidden="true">↗</span></a></div></div></article></Reveal>
        <Reveal delay={0.1}><article className="conference-card"><div className="conference-card-icon">✳</div><div><p className="card-eyebrow">POSTER PRESENTATION · ABSTRACT NO. {researchMeta.abstractNumber}</p><h3>{researchMeta.conference}</h3><p>{researchMeta.dates} <span>·</span> {researchMeta.venue}</p><p className="conference-organiser">Organised by {researchMeta.organiser} in partnership with the Ministry of Health.</p></div><span className="conference-year">2026</span></article></Reveal>
        <p className="ethics-line"><span>◎</span> Ethics approval: Moi University Institutional Research and Ethics Committee (IREC). All patient data used in the study were anonymised.</p>
      </div>
    </section>
  );
}
