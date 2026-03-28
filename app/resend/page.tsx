'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type Status = 'idle' | 'loading' | 'success' | 'limit' | 'error';

function ResendForm() {
  const searchParams = useSearchParams();
  // Pre-fill email from query param (set by /watch when redirecting)
  const [email, setEmail] = useState(() => searchParams.get('email') || '');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/token/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setStatus('limit');
        setMessage(data.error);
        return;
      }

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message);
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <main className='min-h-screen bg-background flex items-center justify-center px-6 py-16'>
      <div className='w-full max-w-md'>
        {/* Logo */}
        <div className='text-center mb-8'>
          <Link href='/'>
            <span className='text-xl font-black tracking-tight'>
              PLAN <span className='text-primary'>B</span>
            </span>
          </Link>
        </div>

        <AnimatePresence mode='wait'>
          {/* ── Success state ── */}
          {status === 'success' && (
            <motion.div
              key='success'
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='bg-card border border-primary/20 rounded-3xl p-8 text-center'
            >
              <div className='text-4xl mb-4'>📬</div>
              <h2 className='text-lg font-bold mb-3'>Check Your Inbox</h2>
              <p className='text-muted-foreground text-sm leading-relaxed mb-6'>
                {message}
              </p>
              <p className='text-muted-foreground/50 text-xs'>
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setStatus('idle');
                    setMessage('');
                  }}
                  className='text-primary hover:text-primary/70 transition-colors'
                >
                  try again
                </button>
                .
              </p>
            </motion.div>
          )}

          {/* ── Limit reached state ── */}
          {status === 'limit' && (
            <motion.div
              key='limit'
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='bg-card border border-foreground/10 rounded-3xl p-8 text-center'
            >
              <div className='text-4xl mb-4'>🚫</div>
              <h2 className='text-lg font-bold mb-3'>Limit Reached</h2>
              <p className='text-muted-foreground text-sm leading-relaxed mb-6'>
                {message}
              </p>
              <Link
                href='/'
                className='inline-flex items-center justify-center text-primary hover:text-primary/70 text-sm font-medium transition-colors'
              >
                ← Back to Home
              </Link>
            </motion.div>
          )}

          {/* ── Form (idle / loading / error) ── */}
          {['idle', 'loading', 'error'].includes(status) && (
            <motion.div
              key='form'
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='bg-card border border-foreground/10 rounded-3xl p-8'
            >
              <h1 className='text-xl font-bold mb-2'>Request New Link</h1>
              <p className='text-muted-foreground text-sm mb-6 leading-relaxed'>
                Enter the email address you used during purchase and we&apos;ll
                send you a fresh access link.
              </p>

              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-foreground/70'
                  >
                    Email Address
                  </label>
                  <input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='you@example.com'
                    required
                    disabled={status === 'loading'}
                    className='w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50'
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-destructive text-sm'
                  >
                    {message}
                  </motion.p>
                )}

                <button
                  type='submit'
                  disabled={status === 'loading' || !email}
                  className='w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2'
                >
                  {status === 'loading' ? (
                    <>
                      <div className='size-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
                      Sending...
                    </>
                  ) : (
                    'Send Access Link'
                  )}
                </button>
              </form>

              <p className='text-muted-foreground/40 text-xs mt-6 text-center leading-relaxed'>
                View limits apply · Monthly: 3 · Yearly: 15
                <br />
                <a
                  href='mailto:dmsupotplanb@gmail.com'
                  className='text-primary hover:text-primary/70 transition-colors'
                >
                  Contact support
                </a>{' '}
                if you need help.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

// Wrap in Suspense — required because useSearchParams needs it in App Router
export default function ResendPage() {
  return (
    <Suspense>
      <ResendForm />
    </Suspense>
  );
}
