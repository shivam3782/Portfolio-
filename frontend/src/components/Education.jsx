import { education } from '../data/content';
import SectionHeading from './SectionHeading';
export default function Education() {
  return <section id="education" className="section"><SectionHeading number="04" title="A foundation for what’s next" tag="Education" /><div className="education-list">{education.map((item, i) => <article className="education-row" key={item.degree}><p className="mono"><span className="accent">0{i + 1} / </span>{item.years}</p><div><h3>{item.degree}</h3><p>{item.school}</p></div><span className="result">{item.result}</span></article>)}</div></section>;
}

