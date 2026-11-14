import { motion } from 'motion/react';
import useSpotlight from '../hooks/useSpotlight';
export default function Surface({
  children,
  className = '',
  tilt = false
}) {
  const {
    glow,
    ...props
  } = useSpotlight(tilt);
  return <motion.article className={`surface ${className}`} {...props}><motion.div className="spotlight" style={glow} aria-hidden="true" />{children}</motion.article>;
}
