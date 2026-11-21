import { useEffect, useState, useSyncExternalStore } from 'react';

const preference = '(prefers-color-scheme: light)';
function systemTheme() {
  return window.matchMedia(preference).matches ? 'light' : 'dark';
}
function subscribe(listener) {
  const media = window.matchMedia(preference);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
function savedTheme() {
  try {
    const value = localStorage.getItem('portfolio-theme');
    return ['light', 'dark'].includes(value) ? value : null;
  } catch { return null; }
}
export default function useTheme() {
  const [override, setOverride] = useState(savedTheme);
  const system = useSyncExternalStore(subscribe, systemTheme, () => 'dark');
  const theme = override || system;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f8f7f1' : '#151612');
  }, [theme]);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    try { localStorage.setItem('portfolio-theme', next); } catch { /* In-memory selection still works. */ }
  }
  return [theme, toggle];
}
