import { motion } from 'motion/react';
import useReducedMotion from '../hooks/useReducedMotion';
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0
}) {
  const reduced = useReducedMotion();
  return <motion.div className={`reveal-mask ${className}`} initial={{
    opacity: 1,
    y: reduced ? 0 : 10
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    amount: .08
  }} transition={{
    duration: .4,
    delay: reduced ? 0 : delay / 1000,
    ease: [.22, 1, .36, 1]
  }}>{children}</motion.div>;
}
