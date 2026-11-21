import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../lib/content';
import ResumeLink from './ui/ResumeLink';
import SocialLinks from './SocialLinks';
const RetroScene = lazy(() => import('./sections/RetroScene'));
export default function Hero() {
  const { profile } = useContent();
  return <section id="home" className="hero" aria-labelledby="hero-title"><div className="hero-topline"><span className="eyebrow">PLAYER ONE / {profile.role}</span>{profile.availability && <span className="availability"><i />{profile.availability}</span>}</div><div className="hero-grid"><div className="hero-copy"><p className="hero-intro">Hello, world. I’m</p><h1 id="hero-title">{profile.name.split(' ')[0]}<br /><span>{profile.name.split(' ').slice(1).join(' ')}<span className="pixel-dot">.</span></span></h1><p className="hero-role">{profile.tagline}</p><p className="hero-statement">{profile.valueProposition}</p><div className="actions"><Link to="/#projects" className="button primary"><span aria-hidden="true">▶</span> View projects</Link><ResumeLink /></div><SocialLinks /></div><Suspense fallback={<div className="scene-placeholder" aria-hidden="true">s/</div>}><RetroScene /></Suspense></div><div className="hero-bottom"><span className="mono">BUILD. LEARN. <span className="accent">LEVEL UP.</span></span><span>{profile.location}</span><Link to="/#about">Scroll to explore <span aria-hidden="true">↓</span></Link></div></section>;
}
