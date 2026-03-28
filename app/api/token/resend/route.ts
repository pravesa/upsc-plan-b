import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '@/lib/mongodb';
import AccessToken, { MONTHLY_LIMIT, YEARLY_LIMIT } from '@/models/AccessToken';
import Order from '@/models/Order';
import { sendResendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    /* ── 1. Check if this email has a paid order ── */
    const order = await Order.findOne({
      email: normalizedEmail,
      status: 'paid',
    });

    if (!order) {
      // Intentionally vague — don't reveal whether email exists
      return NextResponse.json({
        success: true,
        message:
          'If this email has a paid order, a new link will be sent shortly.',
      });
    }

    /* ── 2. Get existing token record ── */
    const record = await AccessToken.findOne({ email: normalizedEmail });

    if (!record) {
      return NextResponse.json({
        success: true,
        message:
          'If this email has a paid order, a new link will be sent shortly.',
      });
    }

    /* ── 3. Apply lazy monthly/yearly reset ── */
    const now = new Date();

    const isNewMonth =
      record.last_monthly_reset.getFullYear() !== now.getFullYear() ||
      record.last_monthly_reset.getMonth() !== now.getMonth();

    if (isNewMonth) {
      record.monthly_views = 0;
      record.last_monthly_reset = now;
    }

    const isNewYear =
      record.last_yearly_reset.getFullYear() !== now.getFullYear();

    if (isNewYear) {
      record.yearly_views = 0;
      record.last_yearly_reset = now;
    }

    /* ── 4. Check monthly limit ── */
    if (record.monthly_views >= MONTHLY_LIMIT) {
      const resetDate = new Date(record.last_monthly_reset);
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);

      return NextResponse.json(
        {
          error: `Monthly view limit reached (${MONTHLY_LIMIT}/month). You can request a new link after ${resetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.`,
          reason: 'monthly_limit',
        },
        { status: 429 },
      );
    }

    /* ── 5. Check yearly limit ── */
    if (record.yearly_views >= YEARLY_LIMIT) {
      const resetDate = new Date(record.last_yearly_reset);
      resetDate.setFullYear(resetDate.getFullYear() + 1);
      resetDate.setMonth(0, 1);

      return NextResponse.json(
        {
          error: `Yearly view limit reached (${YEARLY_LIMIT}/year). Resets on ${resetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
          reason: 'yearly_limit',
        },
        { status: 429 },
      );
    }

    /* ── 6. Invalidate old token + generate new one ── */
    const newToken = uuidv4();

    // New link valid for 24hrs — resets to 60min when play starts
    const expires_at = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    record.token = newToken;
    record.is_expired = false;
    record.expires_at = expires_at;
    record.play_started_at = undefined;
    // ✅ Carry over view counts — do NOT reset
    await record.save();

    /* ── 7. Send new access email ── */
    await sendResendEmail({
      email: normalizedEmail,
      token: newToken,
      monthlyRemaining: MONTHLY_LIMIT - record.monthly_views,
      yearlyRemaining: YEARLY_LIMIT - record.yearly_views,
    });

    return NextResponse.json({
      success: true,
      message: 'A new access link has been sent to your email.',
    });
  } catch (err) {
    console.error('[token/resend]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
