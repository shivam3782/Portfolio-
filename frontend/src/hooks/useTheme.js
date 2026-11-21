import { useSyncExternalStore } from 'react';
const subscribe = listener => { window.addEventListener('portfolio-theme-change', listener); return () => window.removeEventListener('portfolio-theme-change', listener); };
const snapshot = () => document.documentElement.dataset.theme || 'dark';
export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => 'dark');
  return [theme, () => { const next = snapshot() === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; try { localStorage.setItem('portfolio-theme', next); } catch { /* Optional preference. */ } window.dispatchEvent(new Event('portfolio-theme-change')); }];
}
