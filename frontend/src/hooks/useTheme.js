import { useEffect, useState } from 'react';
export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {/* Theme persistence is optional. Admin credentials are never stored. */}
  }, [theme]);
  return [theme, () => setTheme(value => value === 'dark' ? 'light' : 'dark')];
}
