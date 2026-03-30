'use client';

import { ArrowRightIcon } from 'lucide-react';

export default function ResendBanner() {
  return (
    <div className='relative overflow-hidden bg-linear-to-r from-primary/10 via-[#7c3aed]/5 to-primary/10 border-y border-primary/20'>
      <div className='relative z-10 max-w-2xl mx-auto px-6 py-4 flex flex-wrap items-center justify-around gap-4'>
        {/* Left — label */}
        <div className='flex items-center gap-3 shrink-0'>
          <span className='text-base'>🔗</span>
          <p className='text-sm font-semibold text-foreground/80'>
            Already enrolled?{' '}
            <span className='text-muted-foreground font-normal hidden sm:inline'>
              Get your access link instantly.
            </span>
          </p>
        </div>

        <a
          href='/resend'
          className='text-primary hover:text-primary/70 transition-colors inline-flex items-center gap-1.5 underline decoration-1 underline-offset-4 whitespace-nowrap group'
        >
          Resend
          <ArrowRightIcon
            size={16}
            className='group-hover:translate-x-1 transition-transform'
          />
        </a>
      </div>
    </div>
  );
}
