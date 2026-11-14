import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';
// Original pixel robot. Dismissal is held only in module memory.
let sessionDismissed = false;
export default function Mascot({
  onCommand
}) {
  const reduced = useReducedMotion(),
    ref = useRef(null),
    [dismissed, setDismissed] = useState(sessionDismissed);
  const [desktop, setDesktop] = useState(() => matchMedia('(pointer:fine) and (min-width:900px)').matches);
  useEffect(() => {
    const query = matchMedia('(pointer:fine) and (min-width:900px)');
    const update = () => setDesktop(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (reduced || dismissed || !desktop) return;
    const el = ref.current;
    let last = window.scrollY,
      time = performance.now(),
      timer,
      frame;
    const move = e => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--eye-x', `${Math.max(-1, Math.min(1, (e.clientX - r.left) / 200))}px`);
        el.style.setProperty('--eye-y', `${Math.max(-1, Math.min(1, (e.clientY - r.top) / 200))}px`);
      });
    };
    const scroll = () => {
      const now = performance.now(),
        speed = Math.abs(window.scrollY - last) / Math.max(1, now - time);
      last = window.scrollY;
      time = now;
      if (speed > 1.8) {
        el.classList.add('hop');
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove('hop'), 420);
      }
    };
    window.addEventListener('pointermove', move, {
      passive: true
    });
    window.addEventListener('scroll', scroll, {
      passive: true
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
    };
  }, [reduced, dismissed, desktop]);
  if (reduced || dismissed || !desktop) return null;
  return <aside className="mascot" ref={ref} aria-label="Portfolio assistant"><span className="mascot-tip">Press Ctrl+K</span><button className="mascot-dismiss" aria-label="Dismiss mascot for this session" onClick={() => {
      sessionDismissed = true;
      setDismissed(true);
    }}>×</button><button className="mascot-body" onClick={onCommand} aria-label="Open command palette"><svg width="56" height="56" viewBox="0 0 14 14" shapeRendering="crispEdges" aria-hidden="true"><path fill="var(--accent)" d="M6 0h2v2h3v1h1v2h1v5h-2v2h-1v2H8v-2H6v2H4v-2H3v-2H1V5h1V3h1V2h3Z" /><path fill="var(--bg)" d="M3 4h8v5H3Z" /><g className="mascot-eyes" fill="var(--accent-2)"><path d="M4 5h2v2H4Zm4 0h2v2H8Z" /></g><path fill="var(--bg)" d="M6 10h2v1H6Z" /><path fill="var(--text)" opacity=".4" d="M3 3h7v1H3Z" /></svg></button></aside>;
}
