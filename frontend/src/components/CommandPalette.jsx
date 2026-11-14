import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { links, sections } from '../data/content';
export default function CommandPalette({
  open,
  onClose,
  onTheme,
  onMotion,
  motionPaused
}) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    input.current.focus();
    return () => {
      element.close();
      previous?.focus();
    };
  }, [open]);
  const commands = [{ label: motionPaused ? 'Resume animations' : 'Pause animations', action: onMotion }, {
    label: 'Toggle color theme',
    action: onTheme
  }, {
    label: 'Go to Home',
    section: 'home'
  }, ...sections.map(([id, label]) => ({
    label: `Go to ${label}`,
    section: id
  })), {
    label: 'Download CV',
    href: links.cv,
    download: true
  }, {
    label: 'Open GitHub',
    href: links.github
  }, ...(links.linkedin ? [{
    label: 'Open LinkedIn — Shivam Sharma',
    href: links.linkedin
  }] : []), {
    label: 'Email Shivam',
    href: links.email
  }].filter(command => command.label.toLowerCase().includes(query.toLowerCase()));
  const close = () => {
    setQuery('');
    onClose();
  };
  const handleKeys = event => {
    const buttons = [...dialog.current.querySelectorAll('.command-results button, .command-results a')];
    const current = buttons.indexOf(document.activeElement);
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && buttons.length) {
      event.preventDefault();
      const next = event.key === 'ArrowDown' ? (current + 1) % buttons.length : current <= 0 ? buttons.length - 1 : current - 1;
      buttons[next]?.focus();
    }
    if (event.key === 'Enter' && document.activeElement === input.current) {
      event.preventDefault();
      buttons[0]?.click();
    }
  };
  return <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onCancel={event => {
    event.preventDefault();
    close();
  }} onKeyDown={handleKeys} onClick={event => {
    if (event.target === dialog.current) close();
  }}><div className="command-inner"><div className="window-bar"><h2 id="command-title">COMMAND CENTER</h2><button onClick={close} aria-label="Close command palette">Esc ×</button></div><label className="sr-only" htmlFor="command-search">Search commands</label><input ref={input} id="command-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Where would you like to go?" autoComplete="off" /><div className="command-results">{commands.map(command => command.action ? <button key={command.label} onClick={() => {
          command.action();
          close();
        }}>{command.label}<span aria-hidden="true">↵</span></button> : command.section ? <button key={command.label} onClick={() => {
          navigate(`/#${command.section}`);
          close();
        }}>{command.label}<span aria-hidden="true">↵</span></button> : <a key={command.label} href={command.href} download={command.download || undefined} target={command.href.startsWith('https:') ? '_blank' : undefined} rel="noreferrer" onClick={close}>{command.label}<span aria-hidden="true">↗</span></a>)}{!commands.length && <p>No matching commands.</p>}</div><p className="command-hint">↑ ↓ Navigate · Enter Select · Esc Close</p></div></dialog>;
}
