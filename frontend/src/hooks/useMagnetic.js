import { useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from './useReducedMotion';
export default function useMagnetic() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, {
      stiffness: 260,
      damping: 20
    }),
    sy = useSpring(y, {
      stiffness: 260,
      damping: 20
    });
  return {
    ref,
    style: {
      x: reduced ? 0 : sx,
      y: reduced ? 0 : sy
    },
    onPointerMove: event => {
      if (reduced || event.pointerType !== 'mouse') return;
      const rect = ref.current.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * .12);
      y.set((event.clientY - rect.top - rect.height / 2) * .15);
    },
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    }
  };
}
