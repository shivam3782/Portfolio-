import { useContent } from '../lib/content';
import SectionHeading from './SectionHeading';
export default function Education() {
  const { profile } = useContent();
  return <section id="education" className="section"><SectionHeading number="04" title="The journey so far" tag="Quest log" /><div className="education-list">{profile.education.map(item => <article className="education-row" key={item.degree}><span className="timeline-marker" aria-hidden="true" /><p className="mono">{item.years}</p><div><h3>{item.degree}</h3><p>{item.school}</p></div><span className="result">{item.result}</span></article>)}</div></section>;
}
