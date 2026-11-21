import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sections } from '../data/content';
import useScrollSpy from '../hooks/useScrollSpy';
import ResumeLink from './ui/ResumeLink';
import Icon from './Icon';
import { trapFocus } from '../lib/focus';
export default function Navbar({ onCommand, theme, onTheme, onMenu = () => {} }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const active = useScrollSpy(pathname);
  const dialog = useRef(null), trigger = useRef(null);
  const close = () => { setOpen(false); onMenu(false); dialog.current.close(); trigger.current?.focus(); };
  return <><header className="site-header"><nav className="nav-shell" aria-label="Main navigation"><Link className="wordmark" to="/#home" aria-label="s/ Shivam. — Shivam Sharma home"><span className="wordmark-symbol" aria-hidden="true">s/</span> Shivam<span className="accent">.</span></Link><div className="nav-links">{sections.map(([id, label]) => <Link key={id} to={'/#' + id} aria-current={active === id ? 'location' : undefined}>{label}</Link>)}</div><div className="nav-tools"><ResumeLink className="nav-cv">Resume</ResumeLink><button className="theme-toggle" onClick={onTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button><button className="command-trigger" onClick={event => { event.currentTarget.focus(); onCommand(); }} aria-label="Open command palette"><span aria-hidden="true">⌘</span><kbd>Ctrl K</kbd></button><button className="menu-toggle" ref={trigger} aria-expanded={open} aria-controls="mobile-menu" onClick={() => { setOpen(true); onMenu(true); dialog.current.showModal(); }}>Menu</button></div></nav></header><dialog ref={dialog} id="mobile-menu" onKeyDown={trapFocus} className="mobile-menu" aria-label="Navigation menu" onCancel={event => { event.preventDefault(); close(); }}><div className="window-bar"><span className="mono">GAME MENU</span><button onClick={close}>Close ×</button></div><nav aria-label="Mobile navigation">{sections.map(([id, label]) => <Link key={id} to={'/#' + id} onClick={close}>{label}</Link>)}</nav><ResumeLink onClick={close} /><button className="button secondary" onClick={() => { close(); onCommand(); }}>Command palette</button></dialog></>;
}
