'use client';

import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';

const pains = [
  { icon: '⏳', text: '2–3 years gone in attempts' },
  { icon: '💼', text: 'No job experience to show' },
  { icon: '👨‍👩‍👧', text: 'Family pressure increasing' },
  { icon: '🏃', text: 'Friends moving ahead in careers' },
  { icon: '😨', text: '"What if UPSC doesn\'t work out?" fear' },
];

export default function PainPoints() {
  return (
    <section id='about' className='bg-background-alt py-24 px-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <Reveal className='text-center mb-14'>
          <p className='text-primary font-bold text-xs tracking-[0.18em] uppercase mb-4'>
            Sound Familiar?
          </p>
          <h2
            className='font-serif font-black leading-tight mb-4'
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Feeling Stuck with{' '}
            <span className='text-muted-foreground/50 italic'>UPSC Prep?</span>
          </h2>
          <p className='text-muted-foreground/75 text-base max-w-xl mx-auto leading-relaxed'>
            If any of this resonates, you&apos;re not alone — and you don&apos;t
            have to stay stuck.
          </p>
        </Reveal>

        {/* Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {pains.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{
                  scale: 1.02,
                  borderColor: 'rgba(255,107,53,0.45)',
                }}
                className='pain-card bg-muted/50 border border-muted-foreground/20 rounded-4xl p-6 flex items-start gap-4 cursor-default'
              >
                <span className='text-3xl mt-0.5 leading-none'>{p.icon}</span>
                <p className='text-muted-foreground font-medium leading-normal'>
                  {p.text}
                </p>
              </motion.div>
            </Reveal>
          ))}

          {/* Highlight card */}
          <Reveal delay={0.4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='bg-linear-to-br from-primary/15 to-[#7c3aed]/15 border border-primary/25 rounded-4xl p-6 flex items-start gap-4 cursor-default transition-transform'
            >
              <span className='text-3xl mt-0.5 leading-none'>💡</span>
              <div>
                <p className='text-foreground font-bold mb-1'>
                  You don&apos;t need to quit UPSC
                </p>
                <p className='text-muted-foreground text-sm leading-normal'>
                  But continuing without a Plan B is risky. You just need a
                  smart backup plan.
                </p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
