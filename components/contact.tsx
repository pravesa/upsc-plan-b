'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Reveal } from '@/components/ui/reveal';

const EMAIL = 'dmsupotplanb@gmail.com';

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id='contact' className='bg-background-alt py-24 px-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <Reveal className='text-center mb-14'>
          <p className='text-primary font-bold text-[0.7rem] tracking-[0.18em] uppercase mb-4'>
            Get In Touch
          </p>
          <h2
            className='font-serif font-black mb-4'
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Contact Us
          </h2>
          <p className='text-foreground/38 text-base max-w-xl mx-auto leading-relaxed'>
            We&apos;re here to help with any questions regarding sessions,
            enrollment, payments, or support.
          </p>
        </Reveal>

        {/* Grid */}
        <Reveal delay={0.1}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
            {/* Left col */}
            <div className='flex flex-col gap-5'>
              {/* Email card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className='bg-card border border-foreground/[0.07] rounded-4xl p-6'
              >
                <div className='w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl mb-4'>
                  📧
                </div>
                <p className='text-foreground/35 text-[0.7rem] font-bold tracking-[0.12em] uppercase mb-1'>
                  Email Support
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className='text-foreground font-bold text-base hover:text-primary transition-colors break-all'
                >
                  {EMAIL}
                </a>
              </motion.div>

              {/* Response time */}
              <div className='bg-linear-to-br from-primary/8 to-[#7c3aed]/8 border border-primary/18 rounded-4xl p-6 text-sm text-foreground/42 leading-[1.65]'>
                <p className='text-foreground font-semibold mb-2'>
                  ⏰ Response Time
                </p>
                We typically respond within 24–48 hours. For enrollment issues,
                please include your transaction details.
              </div>
            </div>

            {/* Right col – form */}
            <div className='bg-card border border-foreground/[0.07] rounded-[24px] p-8 flex flex-col gap-4'>
              <h3 className='font-bold text-[1.05rem]'>Send a Message</h3>

              <Input
                placeholder='Your Name'
                className='bg-foreground/4 border-foreground/10 text-foreground placeholder:text-foreground/22 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50'
              />
              <Input
                type='email'
                placeholder='Your Email'
                className='bg-foreground/4 border-foreground/10 text-foreground placeholder:text-foreground/22 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50'
              />
              <Textarea
                rows={4}
                placeholder='How can we help you?'
                className='bg-foreground/4 border-foreground/10 text-foreground placeholder:text-foreground/22 rounded-xl resize-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50'
              />

              <AnimatePresence mode='wait'>
                {sent ? (
                  <motion.p
                    key='sent'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center py-3 text-primary font-bold text-base'
                  >
                    ✅ Message sent! We&apos;ll be in touch.
                  </motion.p>
                ) : (
                  <motion.div key='btn' initial={{ opacity: 1 }}>
                    <Button
                      onClick={() => setSent(true)}
                      className='w-full hover:bg-primary/80 font-bold text-base py-3.5 rounded-xl border-0 shadow-[0_4px_20px_rgba(255,107,53,0.25)]'
                    >
                      Send Message →
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className='text-foreground/18 text-xs text-center'>
                Or email directly:{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className='hover:text-foreground/50 transition-colors'
                >
                  {EMAIL}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
