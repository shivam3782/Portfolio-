import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { links } from '../data/content';
import { toggleMotion, useMotionPaused } from '../hooks/useReducedMotion';
import Icon from './Icon';

const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
const address = links.email.slice('mailto:'.length);

export default function Footer() {
  const [time, setTime] = useState(() => clock.format(new Date()));
  const [copyStatus, setCopyStatus] = useState('');
  const paused = useMotionPaused();
  useEffect(() => {
    const timer = setInterval(() => setTime(clock.format(new Date())), 60000);
    return () => clearInterval(timer);
  }, []);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(address);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus('Select the address to copy it manually.');
    }
  }
  return (
    <footer id="contact" className="studio-footer">
      <div className="container">
        <div className="contact-stamp"><span className="studio-status"><i />Open to opportunities</span><span>Mumbai · {time} IST</span></div>
        <div className="contact-main">
          <h2>Get in <em>touch.</em></h2>
          <div className="contact-address">
            <a href={links.email}>{address}</a>
            <button onClick={copyEmail} aria-label="Copy email address"><Icon name={copyStatus === 'Email copied' ? 'check' : 'copy'} size={19} /></button>
          </div>
          <span className="copy-status" role="status">{copyStatus}</span>
        </div>
        <div className="social-strip">
          <a href={links.github} target="_blank" rel="noreferrer"><Icon name="github" />GitHub <Icon name="external" size={15} /></a>
          <a href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" />LinkedIn <Icon name="external" size={15} /></a>
          <a href={links.cv} download><Icon name="down" />Download résumé</a>
        </div>
        <div className="studio-colophon"><span>© {new Date().getFullYear()} Shivam Sharma</span><button onClick={toggleMotion} aria-pressed={paused}>{paused ? 'Resume motion' : 'Pause motion'}</button><Link to="/#home">Back to top ↑</Link></div>
      </div>
    </footer>
  );
}
