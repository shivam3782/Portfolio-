import { skills } from '../data/content';
import SectionHeading from './SectionHeading';
export default function Skills() {
  return <section id="skills" className="section"><SectionHeading number="03" title="The toolkit" tag="Technical foundations">The languages, frameworks and tools I use to connect an idea to its implementation.</SectionHeading><div className="skills-grid">{Object.entries(skills).map(([group, items], i) => <article className="skill-group" key={group}><span className="mono skill-index">0{i + 1}</span><div><h3>{group === 'ML/AI' ? 'Machine learning & AI' : group === 'Tools' ? 'Tools & infrastructure' : group === 'Frontend' ? 'Frontend & mobile' : group === 'Backend' ? 'Backend & APIs' : group}</h3><ul>{items.map(t => <li key={t}>{t}</li>)}</ul></div></article>)}</div></section>;
}

