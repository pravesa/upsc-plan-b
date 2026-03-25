'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, LoaderCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─── Types ─── */
type Step = 'form' | 'processing' | 'success' | 'error' | 'exists';

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
}

/* ─── Load Cashfree SDK lazily ─── */
async function loadCashfree() {
  const { load } = await import('@cashfreepayments/cashfree-js');
  return load({
    mode:
      (process.env.NEXT_PUBLIC_CASHFREE_ENV as 'sandbox' | 'production') ??
      'sandbox',
  });
}

export function EnrollModal({ open, onClose }: EnrollModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  /* ── Reset on close ── */
  function handleClose() {
    onClose();
    // Delay reset so exit animation plays cleanly
    setTimeout(() => {
      setStep('form');
      setMessage('');
      setErrors({});
    }, 300);
  }

  /* ── Close on overlay click ── */
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) handleClose();
  }

  /* ── Client-side validation ── */
  function validate() {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStep('processing');

    try {
      /* 1. Create order on backend */
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 409) {
        setStep('exists');
        return;
      }

      if (!res.ok) {
        setMessage(data.error ?? 'Something went wrong. Please try again.');
        setStep('error');
        return;
      }

      /* 2. Load Cashfree SDK + open checkout */
      const cashfree = await loadCashfree();

      cashfree
        .checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_modal',
        })
        .then(
          (result: {
            error?: { message: string };
            paymentDetails?: unknown;
          }) => {
            if (result.error) {
              setMessage(
                result.error.message ?? 'Payment failed. Please try again.',
              );
              setStep('error');
              return;
            }
            // Payment success — webhook handles the rest
            // Show success screen while webhook processes
            setStep('success');
          },
        );
    } catch {
      setMessage('Something went wrong. Please try again.');
      setStep('error');
    }
  }

  return (
    <AnimatePresence>
      {open && (
        /* ── Backdrop ── */
        <motion.div
          ref={overlayRef}
          key='modal-overlay'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className='fixed inset-0 z-100 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4'
        >
          {/* ── Modal panel ── */}
          <motion.div
            key='modal-panel'
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className='relative w-full max-w-md bg-card border border-foreground/10 rounded-3xl p-8 shadow-2xl'
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className='absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-foreground/5'
              aria-label='Close'
            >
              <XIcon size={18} />
            </button>

            <AnimatePresence mode='wait'>
              {/* ── Form step ── */}
              {step === 'form' && (
                <motion.div
                  key='form'
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className='mb-6'>
                    <h2 className='text-xl font-black mb-1'>
                      Enroll for <span className='text-primary'>₹199</span>
                    </h2>
                    <p className='text-muted-foreground text-sm'>
                      One-time payment · Instant access · Under 15 minutes
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    {/* Name */}
                    <Field
                      label='Full Name'
                      id='name'
                      type='text'
                      placeholder='Priya Sharma'
                      value={form.name}
                      error={errors.name}
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    />

                    {/* Email */}
                    <Field
                      label='Email Address'
                      id='email'
                      type='email'
                      placeholder='priya@example.com'
                      value={form.email}
                      error={errors.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />

                    {/* Phone */}
                    <Field
                      label='Phone Number'
                      id='phone'
                      type='tel'
                      placeholder='98765 43210'
                      value={form.phone}
                      error={errors.phone}
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    />

                    <Button
                      type='submit'
                      size='lg'
                      className='w-full mt-2 font-black rounded-xl border-0 shadow-lg shadow-primary/25'
                    >
                      Pay ₹199 Securely →
                    </Button>

                    <p className='text-muted-foreground/40 text-xs text-center'>
                      Secured by Cashfree · All sales final · Prices in INR
                    </p>
                  </form>
                </motion.div>
              )}

              {/* ── Processing step ── */}
              {step === 'processing' && (
                <motion.div
                  key='processing'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center gap-4 py-10'
                >
                  <LoaderCircleIcon
                    size={36}
                    className='text-primary animate-spin'
                  />
                  <p className='text-sm text-muted-foreground'>
                    Opening payment...
                  </p>
                </motion.div>
              )}

              {/* ── Success step ── */}
              {step === 'success' && (
                <motion.div
                  key='success'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='flex flex-col items-center gap-4 py-8 text-center'
                >
                  <div className='text-5xl'>🎯</div>
                  <h2 className='text-xl font-black'>Payment Successful!</h2>
                  <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
                    Your access link is being sent to{' '}
                    <strong className='text-foreground'>{form.email}</strong>.
                    Check your inbox in a few seconds.
                  </p>
                  <p className='text-muted-foreground/50 text-xs'>
                    Didn&apos;t receive it? Check spam or visit{' '}
                    <a
                      href='/resend'
                      className='text-primary hover:text-primary/70 transition-colors'
                    >
                      /resend
                    </a>
                    .
                  </p>
                  <Button
                    onClick={handleClose}
                    variant='outline'
                    size='sm'
                    className='mt-2 rounded-xl'
                  >
                    Close
                  </Button>
                </motion.div>
              )}

              {/* ── Already exists step ── */}
              {step === 'exists' && (
                <motion.div
                  key='exists'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center gap-4 py-8 text-center'
                >
                  <div className='text-5xl'>📬</div>
                  <h2 className='text-xl font-black'>Already Enrolled!</h2>
                  <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
                    This email already has access. Check your inbox or request a
                    new link below.
                  </p>
                  <div className='flex gap-3 mt-2'>
                    <Button
                      asChild
                      size='sm'
                      className='rounded-xl font-bold border-0 shadow-md shadow-primary/20'
                    >
                      <a
                        href={`/resend?email=${encodeURIComponent(form.email)}`}
                      >
                        Get My Link
                      </a>
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant='outline'
                      size='sm'
                      className='rounded-xl'
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Error step ── */}
              {step === 'error' && (
                <motion.div
                  key='error'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className='flex flex-col items-center gap-4 py-8 text-center'
                >
                  <div className='text-5xl'>⚠️</div>
                  <h2 className='text-xl font-black'>Something Went Wrong</h2>
                  <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
                    {message}
                  </p>
                  <div className='flex gap-3 mt-2'>
                    <Button
                      onClick={() => setStep('form')}
                      size='sm'
                      className='rounded-xl font-bold border-0'
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={handleClose}
                      variant='outline'
                      size='sm'
                      className='rounded-xl'
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Reusable field component ─── */
function Field({
  label,
  id,
  type,
  placeholder,
  value,
  error,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label htmlFor={id} className='text-sm font-medium text-foreground/70'>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-background border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all
          ${
            error
              ? 'border-destructive focus:ring-1 focus:ring-destructive/30'
              : 'border-foreground/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/20'
          }`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-destructive text-xs'
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
