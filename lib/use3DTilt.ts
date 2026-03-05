'use client';

import { useRef } from 'react';
import { useSpring, useTransform } from 'framer-motion';

/* ─── Spring config — snappy but smooth ─── */
export const TILT_SPRING = { stiffness: 300, damping: 28, mass: 0.5 };

const MAX_TILT = 14; /* degrees */
const MAX_SHINE_X = 60; /* % shift for the shine overlay */

/* ─── Hook: tracks pointer position relative to element center ─── */
export function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useSpring(0, TILT_SPRING);
  const rawY = useSpring(0, TILT_SPRING);

  /* rotateY: cursor right → tilt right (+), cursor left → tilt left (−) */
  const rotateY = useTransform(rawX, [-1, 1], [-MAX_TILT, MAX_TILT]);
  /* rotateX: cursor up → tilt back (−), cursor down → tilt forward (+) */
  const rotateX = useTransform(rawY, [-1, 1], [MAX_TILT, -MAX_TILT]);

  /* Shine overlay shifts opposite to tilt for a realistic light effect */
  const shineX = useTransform(rawX, [-1, 1], [MAX_SHINE_X, -MAX_SHINE_X]);
  const shineY = useTransform(rawY, [-1, 1], [MAX_SHINE_X, -MAX_SHINE_X]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    /* Normalise to −1 … +1 */
    rawX.set((e.clientX - left - width / 2) / (width / 2));
    rawY.set((e.clientY - top - height / 2) / (height / 2));
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return { ref, rotateX, rotateY, shineX, shineY, onMouseMove, onMouseLeave };
}
