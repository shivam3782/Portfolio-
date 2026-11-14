import { Link } from 'react-router-dom';
import { links } from '../data/content';
import Icon from './Icon';
import EngineeringScene from './EngineeringScene';

export default function Hero({ compact = false }) {
  return <section id="home" className="hero" aria-labelledby="hero-title">
    <div className="hero-topline"><span className="hero-identity"><b>Shivam Sharma</b><span className="mono">SOFTWARE ENGINEER</span></span><span className="availability"><i />Open to opportunities</span></div>
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">Full-stack development · AI &amp; ML</p>
        <h1 id="hero-title">A curious mind.<br />A builder’s <span>instinct.</span></h1>
        <p className="hero-statement">I’m Shivam Sharma. I build web and mobile applications, explore machine learning, and turn complex problems into useful software.</p>
        <div className="actions"><Link to="/#projects" className="button primary">Explore my work<Icon name="arrow" /></Link><a className="button secondary" href={links.cv} download>Download resume<Icon name="down" /></a></div>
        <div className="hero-socials"><a href={links.github} target="_blank" rel="noreferrer"><Icon name="github" size={18} />GitHub<Icon name="arrow" size={14} /></a><a href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={18} />LinkedIn<Icon name="arrow" size={14} /></a><span>Mumbai, India</span></div>
      </div>
      {!compact && <EngineeringScene />}
    </div>
    <div className="hero-bottom"><p><span className="accent">01 /</span> From interface to API.<br /><span className="muted">React, Node.js, Python &amp; a little curiosity.</span></p><Link to="/#projects" className="scroll-cue">SELECTED WORK <span>↓</span></Link></div>
  </section>;
}

