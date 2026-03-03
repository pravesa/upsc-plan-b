'use client';

import { motion, cubicBezier } from 'framer-motion';
import { Button } from '@/components/ui/button';

const EMAIL = 'dmsupotplanb@gmail.com';

// Stagger variants for hero content
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: cubicBezier(0.22, 1, 0.36, 1) },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

export default function Hero() {
  return (
    <section
      id='hero'
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-background'
    >
      {/* ── Animated blobs ── */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary blur-[120px] animate-blob-a opacity-[0.15]' />
        <div className='absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#7c3aed] blur-[140px] animate-blob-b opacity-[0.1]' />
        <div className='absolute top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-[#f59e0b] blur-[100px] animate-blob-c opacity-[0.08]' />
        {/* Grid overlay */}
        <div className='absolute inset-0 bg-grid-white' />
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='relative z-10 text-center px-6 pt-28 pb-16 max-w-4xl mx-auto'
      >
        {/* Tag pill */}
        <motion.div
          variants={fadeUp}
          className='inline-flex items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-full px-4.5 py-2 text-sm text-foreground/65 mb-6 backdrop-blur-sm'
        >
          <span className='inline-block w-2 h-2 rounded-full bg-primary animate-dot-pulse' />
          Only ₹199 · Instant Access · Under 15 Minutes
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          className='font-serif font-black leading-[0.95] tracking-tight mb-6'
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          UPSC Didn&apos;t
          <br />
          <span className='text-primary italic'>Work Out?</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className='text-foreground/55 max-w-xl mx-auto mb-4 leading-[1.65]'
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
        >
          Don&apos;t waste your years. Build your backup plan in just{' '}
          <strong className='text-foreground'>1 session.</strong>
        </motion.p>

        {/* Body */}
        <motion.p
          variants={fadeUp}
          className='text-[1rem] text-foreground/32 max-w-136 mx-auto mb-10 leading-[1.65]'
        >
          Stop wasting years without direction. Discover practical, real-world
          backup careers that UPSC aspirants are already choosing.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className='flex flex-wrap items-center justify-center gap-4'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              size='lg'
              className='hover:bg-primary/80 font-black text-[1.1rem] px-10 py-4.5 rounded-2xl border-0 shadow-[0_8px_40px_rgba(255,107,53,0.45)]'
            >
              <a href={`mailto:${EMAIL}`}>🎯 Enroll Now for ₹199</a>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='bg-transparent border-foreground/20 text-foreground/60 hover:text-foreground hover:bg-foreground/6 font-semibold text-[1rem] px-8 py-4.5 rounded-2xl'
            >
              <a href='#benefits'>See What&apos;s Inside ↓</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust */}
        <motion.div
          variants={fadeIn}
          className='flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-foreground/25'
        >
          {[
            'Instant Digital Access',
            'No Refund — All Sales Final',
            'For UPSC Aspirants',
          ].map((t) => (
            <span key={t} className='flex items-center gap-1.5'>
              <span className='text-primary'>✓</span> {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className='animate-bounce-y text-foreground/20 text-2xl absolute bottom-8 left-1/2'>
        ↓
      </div>
    </section>
  );
}
