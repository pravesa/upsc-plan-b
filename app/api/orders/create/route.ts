import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { createOrder, OrderPayload } from '@/lib/paymentService';
import Order from '@/models/Order';

/* ─── Input validation ─── */
function validateInput(name: string, email: string, phone: string) {
  const errors: string[] = [];

  if (!name || name.trim().length < 2)
    errors.push('Name must be at least 2 characters');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('Invalid email address');

  if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, '')))
    errors.push('Invalid Indian phone number');

  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();
    const { name, email, phone } = body;

    /* ── 1. Validate inputs ── */
    const errors = validateInput(name, email, phone);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    await connectDB();

    /* ── 2. Check if already paid ── */
    const existingPaid = await Order.findOne({
      email: email.toLowerCase().trim(),
      status: 'paid',
    });

    if (existingPaid) {
      return NextResponse.json(
        {
          error:
            'This email already has access. Check your inbox or visit /resend to get your link.',
        },
        { status: 409 },
      );
    }

    /* ── 3. Create Cashfree order ── */
    const { order_id, payment_session_id } = await createOrder({
      name,
      email,
      phone,
    });

    /* ── 4. Save pending order to MongoDB ── */
    await Order.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      order_id,
      payment_session_id,
      status: 'pending',
    });

    /* ── 5. Return session ID to frontend ── */
    return NextResponse.json({
      payment_session_id,
      order_id,
    });
  } catch (err) {
    console.error('[orders/create]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
