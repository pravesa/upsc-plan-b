'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';

/* ─── Types ─── */
type Status =
  | 'loading'
  | 'valid'
  | 'expired'
  | 'monthly_limit'
  | 'yearly_limit'
  | 'invalid'
  | 'error';

interface ValidateResponse {
  valid: boolean;
  reason?: string;
  message?: string;
  email?: string;
  embedUrl?: string;
  monthly_views?: number;
  yearly_views?: number;
  monthly_remaining?: number;
  yearly_remaining?: number;
}

function WatchContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'invalid');
  const [message, setMessage] = useState(
    token ? '' : 'No access token found. Please check your email.',
  );
  const [email, setEmail] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [monthlyRemaining, setMonthlyRemaining] = useState(0);
  // const [yearlyRemaining, setYearlyRemaining] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const hasPlayedRef = useRef(false);

  /* ── Validate token on mount ── */
  useEffect(() => {
    if (!token) return;

    async function validate() {
      try {
        const res = await fetch('/api/token/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data: ValidateResponse = await res.json();

        if (data.valid) {
          setEmbedUrl(data.embedUrl ?? '');
          setMonthlyRemaining(data.monthly_remaining ?? 0);
          // setYearlyRemaining(data.yearly_remaining ?? 0);
          setEmail(data.email ?? '');
          setStatus('valid');
        } else {
          setStatus((data.reason as Status) ?? 'invalid');
          setMessage(data.message ?? 'Access denied.');
          setEmail(data.email ?? '');
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    }

    validate();
    // token is derived from searchParams during render — stable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!playerReady || status !== 'valid') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = new (window as any).playerjs.Player('bunny-player');

    async function onPlay() {
      // Fire and forget — non-blocking, video still plays if this fails
      try {
        await fetch('/api/token/expire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch {
        // Non-blocking — video still plays
        console.error('Failed to register play event');
      }
    }

    player.on('ready', () => {
      player.on('play', async () => {
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;

        await onPlay();
      });
    });

    return () => {
      player.off('play');
    };
  }, [playerReady, status, token]);

  return (
    <main className='min-h-screen bg-background flex items-center justify-center px-6 py-16'>
      <AnimatePresence mode='wait'>
        {/* ── Loading ── */}
        {status === 'loading' && (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center gap-4 text-muted-foreground'
          >
            <div className='size-10 rounded-full border-2 border-primary border-t-transparent animate-spin' />
            <p className='text-sm'>Verifying your access...</p>
          </motion.div>
        )}

        {/* ── Valid — show video ── */}
        {status === 'valid' && embedUrl && (
          <motion.div
            key='video'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='w-full max-w-4xl'
          >
            {/* Header */}
            <div className='text-center mb-8'>
              <span className='text-xl font-black tracking-tight'>
                PLAN <span className='text-primary'>B</span>
              </span>
              <h1 className='text-2xl font-bold mt-4 mb-2'>
                Pathfinder Session
              </h1>
              <p className='text-muted-foreground text-sm'>
                {monthlyRemaining} view{monthlyRemaining !== 1 ? 's' : ''}{' '}
                remaining this month
              </p>
            </div>

            {/* Video embed */}
            <div
              className='relative w-full overflow-hidden border border-foreground/10 bg-black'
              style={{ paddingBottom: '56.25%' }} // 16:9
            >
              {/* Bunny player script */}
              <Script
                src='//assets.mediadelivery.net/playerjs/playerjs-latest.min.js'
                strategy='afterInteractive'
                onLoad={() => setPlayerReady(true)}
              />
              <iframe
                id='bunny-player'
                src={embedUrl}
                className='absolute inset-0 w-full h-full'
                loading='lazy'
                allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
                allowFullScreen
              />
            </div>

            {/* Footer note */}
            <p className='text-center text-muted-foreground/50 text-xs mt-6 leading-relaxed'>
              This session is for personal use only. Do not share, record, or
              redistribute.
              <br />
              Need help?{' '}
              <a
                href='mailto:dmsupotplanb@gmail.com'
                className='text-primary hover:text-primary/70 transition-colors'
              >
                Contact support
              </a>
            </p>
          </motion.div>
        )}

        {/* ── Expired / Limit / Invalid / Error ── */}
        {[
          'expired',
          'monthly_limit',
          'yearly_limit',
          'invalid',
          'error',
        ].includes(status) && (
          <motion.div
            key='denied'
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='w-full max-w-md text-center'
          >
            {/* Logo */}
            <div className='mb-8'>
              <span className='text-xl font-black tracking-tight'>
                PLAN <span className='text-primary'>B</span>
              </span>
            </div>

            {/* Status card */}
            <div className='bg-card border border-foreground/10 rounded-3xl p-8'>
              <div className='text-4xl mb-4'>
                {status === 'expired' && '⏰'}
                {status === 'monthly_limit' && '📅'}
                {status === 'yearly_limit' && '📆'}
                {status === 'invalid' && '🔒'}
                {status === 'error' && '⚠️'}
              </div>

              <h2 className='text-lg font-bold mb-3'>
                {status === 'expired' && 'Link Expired'}
                {status === 'monthly_limit' && 'Monthly Limit Reached'}
                {status === 'yearly_limit' && 'Yearly Limit Reached'}
                {status === 'invalid' && 'Invalid Link'}
                {status === 'error' && 'Something Went Wrong'}
              </h2>

              <p className='text-muted-foreground text-sm leading-relaxed mb-6'>
                {message}
              </p>

              {/* Show resend button for expired / limits */}
              {['expired', 'monthly_limit', 'yearly_limit'].includes(
                status,
              ) && (
                <Link
                  href={`/resend${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className='inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors'
                >
                  {status === 'expired'
                    ? 'Request New Link'
                    : 'Check My Access'}
                </Link>
              )}

              {/* For invalid / error — go back home */}
              {['invalid', 'error'].includes(status) && (
                <Link
                  href='/'
                  className='inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors'
                >
                  Go Back Home
                </Link>
              )}
            </div>

            <p className='text-muted-foreground/40 text-xs mt-6'>
              Need help?{' '}
              <a
                href='mailto:dmsupotplanb@gmail.com'
                className='text-primary hover:text-primary/70 transition-colors'
              >
                Contact support
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// Wrap in Suspense — required because useSearchParams needs it in App Router
export default function WatchPage() {
  return (
    <Suspense>
      <WatchContent />
    </Suspense>
  );
}
