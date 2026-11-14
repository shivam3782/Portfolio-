import { useEffect, useState } from 'react';
import useReducedMotion from './useReducedMotion';
export default function useTypewriter(lines, active = true) {
  const reduced = useReducedMotion();
  const [text, setText] = useState(lines[0]);
  const signature = lines.join('|');
  useEffect(() => {
    if (reduced || !active) return;
    const values = signature.split('|');
    let index = 0,
      count = values[0].length,
      deleting = true,
      timer;
    const step = () => {
      const line = values[index];
      count += deleting ? -1 : 1;
      setText(line.slice(0, count));
      let delay = deleting ? 25 : 50;
      if (count === 0) {
        deleting = false;
        index = (index + 1) % values.length;
        delay = 200;
      } else if (count === line.length && !deleting) {
        deleting = true;
        delay = 2600;
      }
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, 2800);
    return () => clearTimeout(timer);
  }, [signature, reduced, active]);
  return reduced ? lines[0] : text;
}
