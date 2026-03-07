'use client';

import { motion, cubicBezier } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';

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
        <div className='absolute top-[-10%] left-[-10%] size-[60vw] rounded-full bg-primary blur-[120px] animate-blob-a opacity-15' />
        <div className='absolute bottom-[-10%] right-[-5%] size-[50vw] rounded-full bg-[#7c3aed] blur-[140px] animate-blob-b opacity-10' />
        <div className='absolute top-[40%] left-[40%] size-[30vw] rounded-full bg-[#f59e0b] blur-[100px] animate-blob-c opacity-10' />
        {/* Grid overlay */}
        <div className='absolute inset-0 bg-hero-grid' />
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='relative z-10 text-center px-6 pt-24 pb-16 max-w-4xl mx-auto'
      >
        {/* Tag pill */}
        <motion.div
          variants={fadeUp}
          className='inline-flex items-center gap-2 bg-muted/25 border border-muted-foreground/25 rounded-full px-4 py-2 text-sm text-muted-foreground mb-6 backdrop-blur-sm'
        >
          <span className='inline-block size-2 rounded-full bg-primary animate-dot-pulse' />
          Only ₹199 · Instant Access · Under 15 Minutes
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={fadeUp}
          className='font-serif font-black leading-none tracking-tight mb-6'
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}
        >
          UPSC Didn&apos;t
          <br />
          <span className='text-primary italic'>Work Out?</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className='text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed'
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
        >
          Don&apos;t waste your years. Build your backup plan in just{' '}
          <strong className='text-foreground whitespace-nowrap'>
            1 session.
          </strong>
        </motion.p>

        {/* Body */}
        <motion.p
          variants={fadeUp}
          className='text-base text-muted-foreground/75 max-w-lg mx-auto mb-10 leading-relaxed'
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
              className='hover:bg-primary/90 font-black text-lg rounded-2xl border-0 shadow-lg shadow-primary/25'
            >
              <a href={`mailto:${EMAIL}`}>🎯 Enroll Now for ₹199</a>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='text-muted-foreground font-semibold text-base px-8 rounded-2xl'
            >
              <a href='#benefits'>See What&apos;s Inside ↓</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust */}
        <motion.div
          variants={fadeIn}
          className='flex flex-wrap items-center justify-center gap-6 mt-14 text-sm text-muted-foreground/75'
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
      <div className='animate-bounce-y text-muted-foreground/50 absolute bottom-8 left-1/2 w-fit flex flex-col items-center'>
        <ChevronDownIcon className='opacity-50' />
        <ChevronDownIcon className='-mt-4' />
      </div>
    </section>
  );
}
