import { certifications } from '../data/content';
export default function Certifications() {
  return <section id="proof" className="certifications-section"><div className="subsection-heading"><p className="section-label">CONTINUED LEARNING</p><h2>Certifications &amp; learning milestones</h2></div><div className="certification-list">{certifications.map((item, i) => <article className="cert-row" key={item}><span className="cert-index mono">0{i + 1}</span><h3>{item}</h3><span aria-hidden="true" className="cert-check">↗</span></article>)}</div></section>;
}

