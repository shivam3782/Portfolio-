import { useContent } from '../lib/content';
import SectionHeading from './SectionHeading';
export default function Skills() {
  const { profile } = useContent();
  return <section id="skills" className="section"><SectionHeading number="03" title="Equipped to build" tag="The inventory">A toolkit across interfaces, APIs and intelligent systems. Always room for one more skill.</SectionHeading><div className="skills-grid">{Object.entries(profile.skills).filter(([group, items]) => items.length && group !== 'Tools').map(([group, items], index) => <article className="skill-group" key={group}><div className="skill-group-heading"><span className="skill-icon" aria-hidden="true">{['{ }', '</>', '⌘', '▤', '✦', '⚒'][index % 6]}</span><h3>{group === 'ML/AI' ? 'Machine learning & AI' : group}</h3></div><ul>{items.map(item => <li key={item}>{item}</li>)}</ul><div className="inventory-slots" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div></article>)}</div></section>;
}
