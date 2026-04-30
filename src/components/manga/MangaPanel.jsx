import { motion } from 'framer-motion';

export default function MangaPanel({ children, className = '', animate = true }) {
  const Comp = animate ? motion.div : 'div';
  const animProps = animate
    ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } }
    : {};

  return (
    <Comp
      {...animProps}
      className={`manga-panel relative overflow-hidden ${className}`}
    >
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-r-[2px] border-b-[2px] border-ink opacity-40" />
      <div className="absolute top-0 right-0 w-3 h-3 border-l-[2px] border-b-[2px] border-ink opacity-40" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-r-[2px] border-t-[2px] border-ink opacity-40" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-l-[2px] border-t-[2px] border-ink opacity-40" />
      {children}
    </Comp>
  );
}