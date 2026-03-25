'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Shine } from '@/components/ui/shine';
import { EnrollModal } from '@/components/enroll-modal';
import { TILT_SPRING, use3DTilt } from '@/lib/use3DTilt';

export default function Pricing() {
  const { ref, rotateX, rotateY, shineX, shineY, onMouseMove, onMouseLeave } =
    use3DTilt();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className='bg-background-alt py-20 px-6 relative overflow-hidden'>
        {/* Grid bg */}
        <div className='absolute inset-0 pointer-events-none bg-pricing-grid' />

        <div className='relative z-10 max-w-3xl mx-auto text-center'>
          <Reveal>
            {/* Perspective wrapper — must NOT rotate itself */}
            <div style={{ perspective: '900px' }}>
              <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ scale: { type: 'spring', ...TILT_SPRING } }}
                className='relative cursor-default rounded-[28px] overflow-hidden'
              >
                {/* Card body */}
                <div className='bg-linear-to-br from-primary/15 via-[#7c3aed]/15 to-primary/15 border border-primary/20 rounded-4xl px-6 py-16 md:p-16'>
                  {/* Shine — sits above bg, below content */}
                  <Shine shineX={shineX} shineY={shineY} />

                  {/* Content — floated forward in Z for depth */}
                  <div style={{ transform: 'translateZ(20px)' }}>
                    <p className='text-primary font-bold text-xs tracking-[0.18em] uppercase mb-4'>
                      One-Time Investment
                    </p>

                    <div
                      className='font-serif font-black leading-none mb-4'
                      style={{ fontSize: 'clamp(5rem, 14vw, 8rem)' }}
                    >
                      ₹199
                    </div>

                    <p className='text-muted-foreground/75 text-base mb-8 leading-relaxed'>
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
                        onClick={() => setModalOpen(true)}
                        size='lg'
                        className='hover:bg-primary/90 font-black text-lg rounded-2xl border-0 shadow-lg shadow-primary/25'
                      >
                        🎯 Enroll Now for ₹199
                      </Button>
                    </motion.div>

                    <p className='text-muted-foreground/50 text-sm mt-5'>
                      All payments processed securely · All sales final · Prices
                      in INR
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      <EnrollModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
