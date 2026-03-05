'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';

interface ShineProps {
  shineX: MotionValue<number>;
  shineY: MotionValue<number>;
}

/* ─── Shine overlay ─── */
export function Shine({ shineX, shineY }: ShineProps) {
  const background = useTransform(
    [shineX, shineY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${50 + x}% ${50 + y}%, oklch(from var(--foreground) l c h / 0.08) 0%, transparent 65%)`,
  );

  return (
    <motion.div
      aria-hidden
      className='pointer-events-none absolute inset-0 rounded-[inherit]'
      style={{ background }}
    />
  );
}
