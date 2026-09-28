export const stats = [
  { value: 250, suffix: '', label: 'Patients reviewed', note: 'cancer patients at MTRH in 2025', tone: 'teal' },
  { value: 27, suffix: '%', label: 'CIN prevalence', note: 'of reviewed patients', tone: 'orange' },
  { value: 60, suffix: '%', label: 'Treatment delayed', note: 'among neutropenic patients*', tone: 'red' },
  { value: 22, suffix: '%', label: 'Febrile neutropenia', note: 'among neutropenic patients*', tone: 'navy' },
];

export const resultStats = [
  { value: '27%', title: 'Overall CIN prevalence', detail: '68 of 250 patients', tone: 'teal' },
  { value: '7%', title: 'Severe CIN', detail: 'life-threatening neutropenia', tone: 'orange' },
  { value: '38%', title: 'Blood cancer CIN rate', detail: '18% among solid tumours', tone: 'teal' },
  { value: '22%', title: 'Febrile neutropenia', detail: 'among patients with CIN', tone: 'orange' },
  { value: '60%', title: 'Treatment delay', detail: 'among patients with CIN', tone: 'red' },
  { value: '~7 days', title: 'Average delay length', detail: 'per treatment delay', tone: 'red' },
];

export const cinByType = [
  { type: 'Blood cancers', rate: 38 },
  { type: 'Solid tumours', rate: 18 },
  { type: 'Overall', rate: 27 },
];

// Outcomes are shown as separate bars, not a pie: categories may overlap.
export const complicationData = [
  { name: 'Treatment delayed', value: 60, color: '#c0392b' },
  { name: 'Febrile neutropenia', value: 22, color: '#e07b39' },
  { name: 'No complication reported', value: 18, color: '#0d7377' },
];

export const nadirTimeline = [
  { day: 'Day 0', event: 'Chemotherapy given' },
  { day: 'Days 1–6', event: 'Neutrophils may begin falling' },
  { day: 'Days 7–14', event: 'Possible nadir; infection risk can be higher' },
  { day: 'Days 14–21', event: 'Counts may recover' },
  { day: 'Next cycle', event: 'Proceed according to clinical assessment' },
];

export const riskFactors = [
  { factor: 'Age >50 years', finding: 'Higher CIN rate', reason: 'Reduced bone marrow reserve with age' },
  { factor: 'Multiple chemotherapy cycles', finding: 'Cumulative CIN risk', reason: 'Each cycle adds marrow suppression' },
  { factor: 'Poor performance status', finding: 'Higher severity', reason: 'Reduced physiological reserves before treatment' },
  { factor: 'Blood cancers', finding: '38% vs 18%', reason: 'The malignancy can directly affect bone marrow' },
];

export const comparison = [
  { param: 'CIN prevalence', mtrh: '27%', hic: '20–40%', ssa: '25–43%' },
  { param: 'Febrile neutropenia', mtrh: '22%', hic: '10–15%', ssa: '20–35%' },
  { param: 'Treatment delay', mtrh: '60%', hic: '30–45%', ssa: '50–67%' },
  { param: 'G-CSF prophylaxis', mtrh: 'Limited', hic: 'Routine', ssa: 'Inconsistent' },
];

export const recommendations = [
  { icon: '🩸', title: 'Routine CBC monitoring', body: 'Consider a locally agreed blood-count monitoring schedule around the expected nadir, guided by regimen and clinical protocol.', tag: 'Practical | Requires clinical review' },
  { icon: '💉', title: 'Risk-based G-CSF', body: 'Assess prophylactic G-CSF according to regimen-specific risk, patient factors, and current national/international guidance.', tag: 'Evidence-based | Individualise decisions' },
  { icon: '📋', title: 'Patient education', body: 'Give clear, locally accessible instructions on fever and infection warning signs and how to seek urgent care.', tag: 'Low cost | Adapt to local pathways' },
  { icon: '📄', title: 'Institutional protocol', body: 'Develop or review a neutropenia pathway tailored to MTRH capacity, including triage, laboratory access, escalation and follow-up.', tag: 'Policy | Multidisciplinary' },
];

export const keywords = [
  'neutropenia', 'chemotherapy', 'cancer treatment delay', 'Moi Teaching and Referral Hospital',
  'Kenya', 'chemotherapy-induced neutropenia', 'febrile neutropenia', 'haematological malignancy',
  'G-CSF', 'western Kenya',
];

export const researchMeta = {
  title: 'Neutropenia Crisis: How Common It Is and How It Delays Cancer Treatment at Moi Teaching and Referral Hospital, Eldoret',
  abstractNumber: '13',
  presentationType: 'Poster presentation',
  conference: '9th Kenya International Cancer Conference (KICC 2026)',
  organiser: 'Kenya Society of Haematology & Oncology (KESHO)',
  dates: '19–21 November 2026',
  venue: 'Sarova Whitesands, Mombasa, Kenya',
  author: 'Samson Nyandika Orina',
  email: 'snyandikasamson@gmail.com',
  institution: 'Moi University, Eldoret, Kenya',
  programme: 'Medical Laboratory Sciences',
  linkedin: 'https://www.linkedin.com/in/samson-nyandika-3a8b87389',
};
