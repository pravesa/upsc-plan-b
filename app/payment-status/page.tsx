'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

type Status = 'verifying' | 'sending' | 'done' | 'failed';

interface VerifyResponse {
  success: boolean;
  email: string;
  already_existed: boolean;
  error?: string;
}

function PaymentReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id') ?? '';

  const [status, setStatus] = useState<Status>('verifying');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!orderId) {
      router.replace('/');
      return;
    }

    async function verify() {
      try {
        // Step 1 — verify payment status and trigger token generation
        const res = await fetch('/api/orders/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId }),
        });

        const data: VerifyResponse = await res.json();

        if (!res.ok || !data.success) {
          setStatus('failed');
          setMessage(data.error ?? 'Payment could not be verified.');
          return;
        }

        setEmail(data.email);
        setStatus('sending');

        // Step 2 — short delay then tell user to check email
        setTimeout(() => setStatus('done'), 1500);
      } catch {
        setStatus('failed');
        setMessage('Something went wrong. Please contact support.');
      }
    }

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className='min-h-screen bg-background flex items-center justify-center px-6'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className='w-full max-w-md text-center'
      >
        <div className='mb-8'>
          <span className='text-xl font-black tracking-tight'>
            PLAN <span className='text-primary'>B</span>
          </span>
        </div>

        <div className='bg-card border border-foreground/10 rounded-3xl p-8'>
          {status === 'verifying' && (
            <>
              <div className='size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4' />
              <p className='text-muted-foreground text-sm'>
                Verifying payment...
              </p>
            </>
          )}

          {status === 'sending' && (
            <>
              <div className='size-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4' />
              <p className='text-muted-foreground text-sm'>
                Sending your access link...
              </p>
            </>
          )}

          {status === 'done' && (
            <motion.div
              key='success'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col items-center gap-4 text-center'
            >
              <div className='text-5xl'>🎯</div>
              <h2 className='text-xl font-black mb-4'>Payment Successful!</h2>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Your access link is being sent to{' '}
                <strong className='text-foreground'>{email}</strong>. Check your
                inbox in a few seconds.
              </p>
              <p className='text-muted-foreground/50 text-xs'>
                Didn&apos;t receive it? Check spam or visit{' '}
                <a
                  href={'/resend?email=' + encodeURIComponent(email)}
                  className='text-primary hover:text-primary/70 transition-colors'
                >
                  /resend
                </a>
                .
              </p>
            </motion.div>
          )}

          {status === 'failed' && (
            <>
              <div className='text-4xl mb-4'>⚠️</div>
              <h2 className='text-xl font-black mb-3'>Something Went Wrong</h2>
              <p className='text-muted-foreground text-sm leading-relaxed mb-4'>
                {message}
              </p>
              <a
                href='mailto:dmsupotplanb@gmail.com'
                className='text-primary hover:text-primary/70 text-sm transition-colors'
              >
                Contact support →
              </a>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense>
      <PaymentReturn />
    </Suspense>
  );
}
