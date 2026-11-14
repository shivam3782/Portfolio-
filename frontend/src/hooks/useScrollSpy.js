import { useEffect, useState } from 'react';
export default function useScrollSpy(pathname) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (pathname !== '/') return;
    const update = () => {
      const sections = [...document.querySelectorAll('main section[id], footer[id]')];
      const current = sections.filter(section => section.getBoundingClientRect().top <= 180).at(-1);
      setActive(current?.id === 'proof' ? 'mentoring' : current?.id || 'home');
    };
    update();
    window.addEventListener('scroll', update, {
      passive: true
    });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]);
  return pathname === '/' ? active : '';
}
