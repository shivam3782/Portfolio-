import { useEffect, useEffectEvent } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import useReducedMotion from './useReducedMotion';

// Native wheel/touch scrolling stays untouched; only explicit anchors animate.
export default function useSmoothScroll(paused) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reduced = useReducedMotion();
  const scrollToTarget = useEffectEvent((top, hasAnchor) => {
    window.scrollTo({ top: Math.max(0, top), behavior: hasAnchor && !reduced ? 'smooth' : 'instant' });
  });
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (paused) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [paused]);
  useEffect(() => {
    // On entry and history traversal, let the browser restore scroll and keyboard focus.
    if (!location.hash && navigationType === 'POP') return;
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
        scrollToTarget(top, Boolean(id));
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    };
    const observer = new MutationObserver(navigate);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    const timeout = setTimeout(() => observer.disconnect(), 10000);
    navigate();
    return () => { observer.disconnect(); clearTimeout(timeout); cancelAnimationFrame(frame); };
  }, [location, navigationType]);
}
