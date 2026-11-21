import { education } from '../data/content';

export default function Education() {
  return (
    <section id="education" className="record-panel">
      <h2 className="studio-heading">Education</h2>
      {education.map(item => (
        <article className="study-record" key={item.degree}>
          <p className="record-meta">{item.years}</p>
          <h3>{item.degree}</h3>
          <p>{item.school}</p>
          <strong>{item.result}</strong>
        </article>
      ))}
    </section>
  );
}
