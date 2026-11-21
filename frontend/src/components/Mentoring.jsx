import { mentoring } from '../data/content';

export default function Mentoring() {
  return (
    <section id="mentoring" className="record-panel mentor-record">
      <h2 className="studio-heading">Leadership</h2>
      <h3>DevOps Club Mentor</h3>
      <p>A. P. Shah Institute of Technology</p>
      <strong className="mentor-count">100<span>+</span></strong>
      <p>students per Docker, Git and GitHub workshop</p>
      <ul>{mentoring.slice(1).map(item => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
