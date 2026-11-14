import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import useReducedMotion from '../hooks/useReducedMotion';
export default function Counter({
  value,
  suffix = ''
}) {
  const ref = useRef(null),
    visible = useInView(ref, {
      once: true
    });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible || reduced) return;
    let frame;
    const start = performance.now();
    const tick = time => {
      const p = Math.min((time - start) / 1100, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced, value]);
  return <span ref={ref}><span className="sr-only">{value}{suffix}</span><span aria-hidden="true">{reduced ? value : count}{suffix}</span></span>;
}
