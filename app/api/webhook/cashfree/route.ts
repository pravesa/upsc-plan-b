import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyWebhook, getOrderStatus } from '@/lib/paymentService';
import { createAccessToken } from '@/lib/createAccessToken';
import Order from '@/models/Order';

// Required for signature verification — do NOT use req.json()
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  let rawBody: string;

  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  /* ── 1. Verify Cashfree webhook signature ── */
  const timestamp = req.headers.get('x-webhook-timestamp') ?? '';
  const signature = req.headers.get('x-webhook-signature') ?? '';

  if (!timestamp || !signature) {
    return NextResponse.json(
      { error: 'Missing signature headers' },
      { status: 401 },
    );
  }

  const isValid = verifyWebhook(signature, rawBody, timestamp);
  if (!isValid) {
    console.warn('[webhook/cashfree] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  /* ── 2. Parse payload ── */
  let payload: {
    type: string;
    data: {
      order: { order_id: string };
      payment: {
        cf_payment_id: string;
        payment_status: string;
      };
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  // Only handle successful payment events
  if (payload.type !== 'PAYMENT_SUCCESS_WEBHOOK') {
    return NextResponse.json({ received: true });
  }

  const { order_id } = payload.data.order;
  const { cf_payment_id, payment_status } = payload.data.payment;

  if (payment_status !== 'SUCCESS') {
    return NextResponse.json({ received: true });
  }

  await connectDB();

  /* ── 3. Find the order ── */
  const order = await Order.findOne({ order_id: order_id });

  if (!order) {
    console.error(`[webhook/cashfree] Order not found: ${order_id}`);
    return NextResponse.json({ received: true });
  }

  // Idempotency — already processed
  if (order.status === 'paid') {
    return NextResponse.json({ received: true });
  }

  /* ── 4. Double-check payment status directly with Cashfree ── */
  const confirmedStatus = await getOrderStatus(order_id);
  if (confirmedStatus !== 'PAID') {
    console.warn(
      `[webhook/cashfree] Order ${order_id} status mismatch: ${confirmedStatus}`,
    );
    return NextResponse.json({ received: true });
  }

  /* ── 5. Update order to paid ── */
  order.status = 'paid';
  order.payment_id = cf_payment_id;
  order.paid_at = new Date();
  await order.save();

  /* ── 6. Create token atomically — safe even if verify route races ── */
  await createAccessToken({ name: order.name, email: order.email });

  console.log(
    `[webhook/cashfree] ✅ Payment processed for ${order.email}, token created`,
  );

  return NextResponse.json({ received: true });
}
