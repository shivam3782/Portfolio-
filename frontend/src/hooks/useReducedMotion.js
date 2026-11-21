import { useSyncExternalStore } from 'react';

const query = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set();
let paused = false;
const notify = () => listeners.forEach(listener => listener());
function subscribe(listener) {
  if (!listeners.size) query.addEventListener('change', notify);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) query.removeEventListener('change', notify);
  };
}
const snapshot = () => query.matches || paused;
export function useSystemReducedMotion() {
  return useSyncExternalStore(subscribe, () => query.matches, () => false);
}
export function toggleMotion() {
  paused = !paused;
  document.documentElement.dataset.motion = paused ? 'paused' : 'auto';
  notify();
}
export function useMotionPaused() {
  return useSyncExternalStore(subscribe, () => paused, () => false);
}
export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}
