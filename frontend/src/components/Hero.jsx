import { Link } from 'react-router-dom';
import { links, profile } from '../data/content';
import Icon from './Icon';
import EngineeringScene from './EngineeringScene';

export default function Hero({ compact = false }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{profile.role}</p>
          <h1 id="hero-title">Shivam <span>Sharma.</span></h1>
          <p className="hero-statement">{profile.introduction}</p>
          <div className="actions">
            <Link to="/#projects" className="button primary">View projects<Icon name="arrow" /></Link>
            <a className="button secondary" href={links.cv} download>Download résumé<Icon name="down" /></a>
          </div>
          <div className="hero-socials">
            <a href={links.github} target="_blank" rel="noreferrer"><Icon name="github" size={18} />GitHub</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={18} />LinkedIn</a>
          </div>
        </div>
        {!compact && <EngineeringScene />}
      </div>
      <div className="hero-bottom">
        <span className="availability"><i aria-hidden="true" />Open to opportunities</span>
        <span>{profile.location}</span>
      </div>
    </section>
  );
}
