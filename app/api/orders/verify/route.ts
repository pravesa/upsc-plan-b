import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getOrderStatus } from '@/lib/paymentService';
import { createAccessToken } from '@/lib/createAccessToken';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id is required' },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.findOne({ order_id: order_id });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found. Please contact support.' },
        { status: 404 },
      );
    }

    /* ── Update order (idempotent) ── */
    if (order.status !== 'paid') {
      /* ── Verify payment with Cashfree ── */
      const confirmedStatus = await getOrderStatus(order_id);

      if (confirmedStatus !== 'PAID') {
        return NextResponse.json(
          { error: 'Payment was not completed. Please try again.' },
          { status: 402 },
        );
      }

      order.status = 'paid';
      order.paid_at = new Date();
      await order.save();
    }

    /* ── Create token atomically — safe even if webhook races ── */
    const { created } = await createAccessToken({
      name: order.name,
      email: order.email,
    });

    // created = false means token already existed (webhook got there first)
    // Either way the user has access — return 200
    return NextResponse.json({
      success: true,
      email: order.email,
      // Let payment-status page know if it was freshly created or already existed
      // so it can show the right UI message
      already_existed: !created,
    });
  } catch (err) {
    console.error('[orders/verify]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please contact support.' },
      { status: 500 },
    );
  }
}
