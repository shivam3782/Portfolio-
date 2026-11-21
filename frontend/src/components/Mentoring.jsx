import { useContent } from "../lib/content";
import SectionHeading from "./SectionHeading";
export default function Mentoring() {
  const { profile } = useContent();
  return (
    <section id="mentoring" className="section">
      <SectionHeading number="05" title="Better, together" tag="Leadership" />
      <article className="mentoring-card">
        <div className="achievement-symbol" aria-hidden="true">
          ✦
        </div>
        <div>
          <p className="section-label">COMMUNITY / DEVOPS CLUB</p>
          <h3>DevOps Club Mentor</h3>
          <p>A. P. Shah Institute of Technology</p>
        </div>
        <ul>
          {profile.leadership.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
      <div className="certifications">
        <h3>Along the way</h3>
        <div>
          {profile.certifications.map((item) => (
            <span className="certification" key={item}>
              <span aria-hidden="true">◇</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
