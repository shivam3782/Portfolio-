import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { links, sections } from '../data/content';
import useScrollSpy from '../hooks/useScrollSpy';
import Icon from './Icon';

export default function Navbar({ onCommand, theme, onTheme, onMenu }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const active = useScrollSpy(pathname, hash);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const close = () => {
    setOpen(false);
    onMenu(false);
    dialog.current.close();
    trigger.current?.focus();
  };
  return <><header className="site-header"><nav className="nav-shell" aria-label="Main navigation">
    <Link className="wordmark" to="/#home" aria-label="Shivam Sharma home"><span className="studio-mark" aria-hidden="true">s/s</span><span>Shivam Sharma</span></Link>
    <div className="nav-links">{sections.map(([id, label]) => <Link key={id} to={'/#' + id} aria-current={active === id ? 'location' : undefined}>{label}{active === id && <span className="active-indicator" />}</Link>)}</div>
    <div className="nav-tools"><a className="nav-cv" href={links.cv} download>Résumé<Icon name="down" size={15} /></a><button className="theme-toggle" onClick={onTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button><button className="command-trigger" onClick={onCommand} aria-label="Open command palette"><kbd>Ctrl K</kbd></button><button className="menu-toggle" ref={trigger} aria-expanded={open} aria-controls="mobile-menu" onClick={() => { setOpen(true); onMenu(true); dialog.current.showModal(); }}>Menu +</button></div>
  </nav></header>
  <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Navigation menu" onCancel={event => { event.preventDefault(); close(); }}>
    <div className="mobile-top"><span>SHIVAM / MENU</span><button onClick={close}>Close ×</button></div>
    <nav aria-label="Mobile navigation">{sections.map(([id, label], i) => <Link key={id} to={'/#' + id} onClick={close}><small>0{i + 1}</small>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
    <a className="button primary" href={links.cv} download onClick={close}>Download resume<Icon name="down" /></a>
    <button className="button secondary" onClick={() => { close(); onCommand(); }}>Command palette</button>
  </dialog></>;
}
