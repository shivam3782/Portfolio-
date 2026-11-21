import { profile } from '../data/content';
import Mascot from './Mascot';
import { Link } from 'react-router-dom';

export default function About({ onCommand }) {
  return (
    <section id="about" className="profile-spread" aria-labelledby="about-title">
      <div className="profile-heading">
        <h2 id="about-title">About <em>me.</em></h2>
        <p>{profile.location}</p>
        <Mascot onCommand={onCommand} />
      </div>
      <div className="profile-text">
        <p>I’m Shivam, an information technology graduate who likes working on both sides of an interface.</p>
        <p>My projects range from a marketplace connecting farmers and consumers to a machine-learning assistant for insurance documents. I work with React and Flutter on the interface, and Node.js, Flask and Python behind it.</p>
        <Link className="studio-text-link" to="/#mentoring">My work as a mentor <span aria-hidden="true">↓</span></Link>
      </div>
    </section>
  );
}
