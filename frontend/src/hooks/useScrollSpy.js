import { useEffect, useState } from 'react';

export default function useScrollSpy(pathname, hash) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (pathname !== '/') return;
    function update() {
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActive('contact');
        return;
      }
      let current = 'home';
      let rowTop = -Infinity;
      for (const section of document.querySelectorAll('main section[id], footer[id]')) {
        const top = section.getBoundingClientRect().top;
        if (top > 155) continue;
        // Parallel education and leadership columns share an anchor position on desktop.
        if (top > rowTop + 1 || (Math.abs(top - rowTop) <= 1 && hash === '#' + section.id)) {
          rowTop = top;
          current = section.id;
        }
      }
      setActive(current);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [pathname, hash]);
  return pathname === '/' ? active : '';
}
