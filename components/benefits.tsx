'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const EMAIL = 'dmsupotplanb@gmail.com';

const benefits = [
  {
    icon: '🗺️',
    title: 'Clear Career Backup Paths',
    desc: 'Specifically mapped for UPSC aspirants — not generic career advice.',
  },
  {
    icon: '⚡',
    title: 'High-Demand Job Options',
    desc: 'Options you can actually start in 3–6 months without starting from zero.',
  },
  {
    icon: '🛠️',
    title: 'Skills to Learn Immediately',
    desc: 'Know exactly which skills to build right now for maximum ROI.',
  },
  {
    icon: '📍',
    title: 'Where to Upskill',
    desc: 'Curated platforms and resources — no endless Googling required.',
  },
  {
    icon: '🚫',
    title: 'Zero Fluff',
    desc: 'Only practical, actionable guidance. This is NOT motivation content.',
  },
];

export default function Benefits() {
  return (
    <section id='benefits' className='bg-background py-28 px-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <Reveal className='text-center mb-14'>
          <p className='text-primary font-bold text-[0.7rem] tracking-[0.18em] uppercase mb-4'>
            What&apos;s Inside
          </p>
          <h2
            className='font-serif font-black leading-[1.05] mb-4'
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            In Just <span className='text-primary'>Under 15</span> Minutes,
            <br />
            You&apos;ll Get:
          </h2>
          <p className='text-foreground/38 text-[1.05rem] max-w-xl mx-auto'>
            One session. Five life-changing frameworks. Real career clarity.
          </p>
        </Reveal>

        {/* Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {benefits.map((b, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{
                  y: -6,
                  boxShadow: '0 20px 60px rgba(255,107,53,0.15)',
                }}
                className='ben-card bg-card border border-foreground/[0.07] rounded-[24px] p-8 h-full transition-shadow'
              >
                <div className='ic w-14 h-14 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-5'>
                  {b.icon}
                </div>
                <h3 className='font-bold text-[1.05rem] mb-2'>{b.title}</h3>
                <p className='text-foreground/38 text-sm leading-[1.65]'>
                  {b.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}

          {/* CTA card */}
          <Reveal delay={0.4}>
            <motion.div
              whileHover={{ y: -6 }}
              className='bg-linear-to-br from-primary to-[#e04f1a] rounded-[24px] p-8 flex flex-col justify-between h-full'
            >
              <div>
                <p className='text-white/70 text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-3'>
                  Plan-B Pathfinder
                </p>
                <h3 className='text-white font-serif font-black text-[2rem] leading-[1.1] mb-3'>
                  Get Clarity
                  <br />
                  for ₹199
                </h3>
                <p className='text-white/65 text-sm mb-6 leading-[1.55]'>
                  Less than a single meal. More direction than years of
                  confusion.
                </p>
              </div>
              <Button
                asChild
                className='w-full bg-white text-primary hover:bg-white/90 font-black text-base py-6 rounded-2xl border-0'
              >
                <a href={`mailto:${EMAIL}`}>👉 Enroll Now</a>
              </Button>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
