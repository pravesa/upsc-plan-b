import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { generateBunnySignedUrl } from '@/lib/bunny';
import AccessToken, { MONTHLY_LIMIT, YEARLY_LIMIT } from '@/models/AccessToken';

/* ─── Lazy reset helper ─── */
function applyLazyReset(token: InstanceType<typeof AccessToken>) {
  const now = new Date();

  // Reset monthly views if we're in a new month
  const isNewMonth =
    token.last_monthly_reset.getFullYear() !== now.getFullYear() ||
    token.last_monthly_reset.getMonth() !== now.getMonth();

  if (isNewMonth) {
    token.monthly_views = 0;
    token.last_monthly_reset = now;
  }

  // Reset yearly views if we're in a new year
  const isNewYear = token.last_yearly_reset.getFullYear() !== now.getFullYear();

  if (isNewYear) {
    token.yearly_views = 0;
    token.last_yearly_reset = now;
  }

  return token;
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await connectDB();

    const record = await AccessToken.findOne({ token });

    /* ── 1. Token not found ── */
    if (!record) {
      return NextResponse.json(
        {
          valid: false,
          reason: 'invalid',
          message: 'This link is invalid. Please check your email.',
        },
        { status: 404 },
      );
    }

    /* ── 2. Apply lazy monthly/yearly reset before checking limits ── */
    applyLazyReset(record);

    /* ── 3. Token expired by time ── */
    const now = new Date();
    if (record.is_expired || record.expires_at < now) {
      // Mark as expired if not already
      if (!record.is_expired) {
        record.is_expired = true;
        await record.save();
      }
      return NextResponse.json({
        valid: false,
        reason: 'expired',
        message: 'This link has expired. Request a new one below.',
        email: record.email,
      });
    }

    /* ── 4. Monthly limit reached ── */
    if (record.monthly_views >= MONTHLY_LIMIT) {
      // Save any lazy resets applied
      await record.save();

      const resetDate = new Date(record.last_monthly_reset);
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);

      return NextResponse.json({
        valid: false,
        reason: 'monthly_limit',
        message: `Monthly view limit reached (${MONTHLY_LIMIT}/month). Resets on ${resetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}.`,
        email: record.email,
      });
    }

    /* ── 5. Yearly limit reached ── */
    if (record.yearly_views >= YEARLY_LIMIT) {
      await record.save();

      const resetDate = new Date(record.last_yearly_reset);
      resetDate.setFullYear(resetDate.getFullYear() + 1);
      resetDate.setMonth(0, 1);

      return NextResponse.json({
        valid: false,
        reason: 'yearly_limit',
        message: `Yearly view limit reached (${YEARLY_LIMIT}/year). Resets on ${resetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
        email: record.email,
      });
    }

    /* ── 6. All checks passed — generate Bunny signed URL + save ── */
    await record.save();

    const { embedUrl } = generateBunnySignedUrl();

    return NextResponse.json({
      valid: true,
      email: record.email,
      embedUrl,
      monthly_views: record.monthly_views,
      yearly_views: record.yearly_views,
      monthly_remaining: MONTHLY_LIMIT - record.monthly_views,
      yearly_remaining: YEARLY_LIMIT - record.yearly_views,
      play_started: !!record.play_started_at,
    });
  } catch (err) {
    console.error('[token/validate]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
