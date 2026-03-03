'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const EMAIL = 'dmsupotplanb@gmail.com';

export default function Pricing() {
  return (
    <section className='bg-background py-20 px-6 relative overflow-hidden'>
      {/* Grid bg */}
      <div className='absolute inset-0 pointer-events-none bg-grid-orange' />

      <div className='relative z-10 max-w-3xl mx-auto text-center'>
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.01 }}
            className='bg-linear-to-br from-primary/08 via-[#7c3aed]/08 to-[#ff6b35]/08 border border-primary/20 rounded-[28px] px-6 py-16 md:p-16'
          >
            <p className='text-primary font-bold text-[0.7rem] tracking-[0.18em] uppercase mb-4'>
              One-Time Investment
            </p>

            <div
              className='font-serif font-black leading-none mb-4'
              style={{ fontSize: 'clamp(5rem, 14vw, 8rem)' }}
            >
              ₹199
            </div>

            <p className='text-foreground/38 text-[1.05rem] mb-8 leading-[1.6]'>
              Instant access to the Plan-B Pathfinder Session.
              <br />
              No subscriptions. No upsells.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className='inline-block'
            >
              <Button
                asChild
                size='lg'
                className='hover:bg-primary/80 font-black text-[1.1rem] px-12 py-4.5 rounded-2xl border-0 shadow-[0_8px_40px_rgba(255,107,53,0.35)]'
              >
                <a href={`mailto:${EMAIL}`}>🎯 Enroll Now for ₹199</a>
              </Button>
            </motion.div>

            <p className='text-foreground/18 text-xs mt-5'>
              All payments processed securely · All sales final · Prices in INR
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
