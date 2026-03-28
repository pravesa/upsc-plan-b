import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AccessToken, { PLAY_EXPIRY_MINUTES } from '@/models/AccessToken';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await connectDB();

    const record = await AccessToken.findOne({ token });

    if (!record) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    if (record.is_expired) {
      return NextResponse.json({ already_expired: true });
    }

    const now = new Date();

    /* ── Play just started for the first time ── */
    if (!record.play_started_at) {
      // Set play start time
      record.play_started_at = now;

      // Reset expires_at to PLAY_EXPIRY_MINUTES from now
      // This replaces the initial 24hr expiry with the tighter 60min window
      record.expires_at = new Date(
        now.getTime() + PLAY_EXPIRY_MINUTES * 60 * 1000,
      );

      // Increment view counts now that play has started
      record.monthly_views += 1;
      record.yearly_views += 1;
      record.last_viewed_at = now;

      await record.save();

      return NextResponse.json({
        success: true,
        expires_at: record.expires_at,
        monthly_views: record.monthly_views,
        yearly_views: record.yearly_views,
      });
    }

    /* ── Play already started before — just return current state ── */
    return NextResponse.json({
      success: true,
      already_started: true,
      expires_at: record.expires_at,
      monthly_views: record.monthly_views,
      yearly_views: record.yearly_views,
    });
  } catch (err) {
    console.error('[token/expire]', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
