import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { links } from '../data/content';
import { toggleMotion, useMotionPaused } from '../hooks/useReducedMotion';
import Icon from './Icon';
const timeFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false });
function mumbaiTime() { return timeFormatter.format(new Date()); }
export default function Footer() {
  const [time, setTime] = useState(mumbaiTime);
  const paused = useMotionPaused();
  useEffect(() => { const id = setInterval(() => setTime(mumbaiTime()), 60000); return () => clearInterval(id); }, []);
  return <footer id="contact" className="footer"><div className="container"><div className="contact-content"><div><p className="section-label"><span>06</span> / WHAT’S NEXT</p><h2>Good work starts<br />with a <span>conversation.</span></h2><p>Have a role, an idea, or a problem worth solving?<br />I’d love to hear about it.</p><a className="email-link" href={links.email}>shivam3782@gmail.com<Icon name="arrow" size={28} /></a></div><div className="contact-aside"><span className="availability"><i />Open to opportunities</span><div className="contact-links"><a href={links.github} target="_blank" rel="noreferrer">GitHub<Icon name="arrow" /></a><a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn<Icon name="arrow" /></a><a href={links.cv} download>Download resume<Icon name="down" /></a></div><p className="mono local-time"><i />{time} IST / MUMBAI, INDIA</p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Shivam Sharma</span><span>Built with curiosity. Made to be useful.</span><button onClick={toggleMotion} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}</button><Link to="/#home">Back to top ↑</Link></div></div></footer>;
}

