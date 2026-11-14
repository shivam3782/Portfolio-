import { mentoring } from '../data/content';
import SectionHeading from './SectionHeading';
import Surface from './Surface';
import RevealOnScroll from './RevealOnScroll';
export default function Mentoring() {
  return <section id="mentoring" className="section"><SectionHeading number="05" title="Learning is better shared" tag="Mentoring & leadership" /><RevealOnScroll><Surface className="mentoring-card"><div><p className="card-tag">COMMUNITY / DEVOPS CLUB</p><h3>DevOps Club Mentor</h3><p>A. P. Shah Institute of Technology</p></div><ul className="terminal-list">{mentoring.map(t => <li key={t}>{t}</li>)}</ul></Surface></RevealOnScroll></section>;
}
