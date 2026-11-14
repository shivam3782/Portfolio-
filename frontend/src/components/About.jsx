import { about } from '../data/content';
import SectionHeading from './SectionHeading';
import RevealOnScroll from './RevealOnScroll';
import Icon from './Icon';
export default function About() {
  return <section id="about" className="section about-section">
    <SectionHeading number="02" title="Curiosity is the common thread" tag="Behind the code" />
    <div className="about-layout"><div className="about-intro"><p className="about-lead">I like understanding how things work.<br /><span className="muted">Then making them work better.</span></p><p>My work spans full-stack applications, mobile development and machine learning. I enjoy connecting the pieces: an interface people can use, an API that holds it together, and data that makes it useful.</p><p>Beyond my own projects, I share what I learn as a DevOps Club mentor at A. P. Shah Institute of Technology.</p><span className="about-signature">Shivam<span className="accent"> / </span><span className="mono">BUILD · LEARN · SHARE</span></span></div>
    <div className="about-practices">{about.map((item, i) => <RevealOnScroll key={item.title} delay={i * 50}><article><span className="practice-icon"><Icon name={item.icon} size={23} /></span><div><h3>{item.title}</h3><p>{item.text}</p></div></article></RevealOnScroll>)}</div></div>
  </section>;
}

