'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from './mode-toggle';

const EMAIL = 'dmsupotplanb@gmail.com';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'nav-scrolled' : ''
      }`}
    >
      <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center gap-3'>
          <span className='text-xl font-black tracking-tight'>
            PLAN <span className='text-primary'>B</span>
          </span>
          <Badge className='bg-primary/15 text-primary border-primary/30 text-[10px] font-bold tracking-widest uppercase rounded-full'>
            Pathfinder
          </Badge>
        </div>

        {/* Nav links – hidden on mobile */}
        <div className='hidden md:flex items-center gap-6'>
          {[
            { label: 'About', href: '#about' },
            { label: 'Benefits', href: '#benefits' },
            { label: 'Policy', href: '#policy' },
            { label: 'Contact', href: '#contact' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className='px-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200'
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          <ModeToggle />

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              className='hover:bg-primary/90 font-bold text-sm rounded-full border-0 shadow-lg shadow-primary/25'
            >
              <a href={`mailto:${EMAIL}`}>Enroll ₹199</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
