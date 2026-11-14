import { useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from './useReducedMotion';
export default function useSpotlight(tilt = false) {
  const ref = useRef(null),
    reduced = useReducedMotion();
  const x = useMotionValue(-400),
    y = useMotionValue(-400),
    rx = useMotionValue(0),
    ry = useMotionValue(0);
  const rotateX = useSpring(rx, {
      stiffness: 220,
      damping: 25
    }),
    rotateY = useSpring(ry, {
      stiffness: 220,
      damping: 25
    });
  return {
    ref,
    glow: {
      x,
      y
    },
    style: {
      rotateX: reduced ? 0 : rotateX,
      rotateY: reduced ? 0 : rotateY
    },
    onPointerMove: e => {
      if (reduced || e.pointerType !== 'mouse' || !matchMedia('(pointer:fine)').matches) return;
      const r = ref.current.getBoundingClientRect(),
        left = e.clientX - r.left,
        top = e.clientY - r.top;
      x.set(left - 160);
      y.set(top - 160);
      if (tilt) {
        rx.set((top / r.height - .5) * -3);
        ry.set((left / r.width - .5) * 3);
      }
    },
    onPointerLeave: () => {
      x.set(-400);
      y.set(-400);
      rx.set(0);
      ry.set(0);
    }
  };
}
