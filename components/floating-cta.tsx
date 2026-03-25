'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { EnrollModal } from '@/components/enroll-modal';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 220 }}
            className='fixed bottom-6 left-1/2 -translate-x-1/2 z-999 md:hidden'
          >
            <Button
              onClick={() => setModalOpen(true)}
              className='bg-primary hover:bg-primary/90 text-white font-black text-base px-8 py-6 rounded-full border-0 shadow-lg shadow-primary/25 whitespace-nowrap'
            >
              🎯 Enroll for ₹199
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <EnrollModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
