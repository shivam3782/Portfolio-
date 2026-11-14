import { motion } from 'motion/react';
import useMagnetic from '../hooks/useMagnetic';
export default function Magnetic({
  children
}) {
  const props = useMagnetic();
  return <motion.span className="magnetic" {...props}>{children}</motion.span>;
}
