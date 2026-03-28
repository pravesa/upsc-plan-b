import { v4 as uuidv4 } from 'uuid';
import { MongoServerError } from 'mongodb';
import AccessToken from '@/models/AccessToken';
import { sendAccessEmail } from '@/lib/email';

interface CreateAccessTokenOptions {
  name: string;
  email: string;
}

interface CreateAccessTokenResult {
  created: boolean; // true = new token, false = already existed
  token: string;
}

/**
 * Atomically creates an access token for a paid user.
 * Safe to call from both webhook and verify routes simultaneously —
 * only one will ever insert, the other gets the existing doc.
 */
export async function createAccessToken({
  name,
  email,
}: CreateAccessTokenOptions): Promise<CreateAccessTokenResult> {
  const now = new Date();
  const newToken = uuidv4();

  try {
    const result = await AccessToken.findOneAndUpdate(
      { email },
      {
        $setOnInsert: {
          email,
          token: newToken,
          is_expired: false,
          expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          monthly_views: 0,
          yearly_views: 0,
          last_monthly_reset: now,
          last_yearly_reset: now,
          created_at: now,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    // If the token in the result matches what we tried to insert
    // → we created it. If it differs → it already existed.
    const created = result.token === newToken;

    if (created) {
      // Only send email when we actually created the token
      // Prevents duplicate emails if both routes fire
      try {
        await sendAccessEmail({ name, email, token: newToken });
      } catch (emailErr) {
        // Log but don't fail — user can use /resend
        console.error('[createAccessToken] Email send failed:', emailErr);
      }
    }

    return { created, token: result.token };
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      const existing = await AccessToken.findOne({ email });
      return { created: false, token: existing!.token };
    }

    throw error;
  }
}
