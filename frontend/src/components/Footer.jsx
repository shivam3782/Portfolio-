import { Link } from 'react-router-dom';
import { useSyncExternalStore } from 'react';
import SocialLinks from './SocialLinks';
import { useContent } from '../lib/content';
const subscribe = listener => { window.addEventListener('portfolio-effects-change', listener); return () => window.removeEventListener('portfolio-effects-change', listener); };
export default function Footer() {
  const { profile } = useContent();
  const effects = useSyncExternalStore(subscribe, () => document.documentElement.dataset.effects !== 'off', () => true);
  return <footer className="footer"><div className="container"><div className="footer-top"><Link className="wordmark" to="/#home"><span className="wordmark-symbol">s/</span> Shivam.</Link><p>Built with curiosity. Made to be useful.</p><SocialLinks /></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><Link to="/#projects">Projects</Link><Link to="/#contact">Contact</Link><button aria-pressed={effects} onClick={() => { const next = !effects; document.documentElement.dataset.effects = next ? 'on' : 'off'; try { localStorage.setItem('portfolio-effects', next ? 'on' : 'off'); } catch { /* Optional preference. */ } window.dispatchEvent(new Event('portfolio-effects-change')); }}>Retro effects: {effects ? 'on' : 'off'}</button><Link to="/#home">Back to top ↑</Link></div></div></footer>;
}
