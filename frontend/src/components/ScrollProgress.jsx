import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let frame = 0;
    function draw() {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      bar.current.style.transform = 'scaleX(' + (range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0) + ')';
      frame = 0;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    draw();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={bar} className="scroll-progress" style={{ transform: 'scaleX(0)' }} aria-hidden="true" />;
}
