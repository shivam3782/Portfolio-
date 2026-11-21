import { useEffect, useState } from 'react';
export default function useScrollSpy(pathname) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (pathname !== '/') return;
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);
  return pathname === '/' ? active : '';
}
