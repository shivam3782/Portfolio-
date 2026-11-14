import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useReducedMotion from './useReducedMotion';

// Native wheel/touch scrolling stays untouched; only explicit anchors animate.
export default function useSmoothScroll(paused) {
  const location = useLocation();
  const reduced = useReducedMotion();
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (paused) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [paused]);
  useEffect(() => {
    let frame;
    const navigate = () => {
      const main = document.getElementById('main-content');
      if (!main || main.getAttribute('aria-busy') === 'true') return;
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
      const target = document.getElementById(id) || main;
      observer.disconnect();
      clearTimeout(timeout);
      frame = requestAnimationFrame(() => {
        const top = id ? target.getBoundingClientRect().top + window.scrollY - 100 : 0;
        window.scrollTo({ top: Math.max(0, top), behavior: id && !reduced ? 'smooth' : 'instant' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    };
    const observer = new MutationObserver(navigate);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 10000);
    navigate();
    return () => { observer.disconnect(); clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [location, reduced]);
}
