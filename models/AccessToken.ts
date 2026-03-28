import mongoose, { Schema, Document, Model } from 'mongoose';

// View limits
export const MONTHLY_LIMIT = 3;
export const YEARLY_LIMIT = 15;
// Video duration (15 min) + 45 min buffer = 60 min expiry after play starts
export const PLAY_EXPIRY_MINUTES = 60;

export interface IAccessToken extends Document {
  email: string;
  token: string;

  // Link state
  is_expired: boolean;
  expires_at: Date; // absolute expiry (set when play starts)
  play_started_at?: Date; // when the user first pressed play

  // View counts
  monthly_views: number;
  yearly_views: number;

  // Reset tracking (lazy reset — checked on each request)
  last_monthly_reset: Date; // last time monthly_views was reset
  last_yearly_reset: Date; // last time yearly_views was reset

  last_viewed_at?: Date;
  created_at: Date;
}

const AccessTokenSchema = new Schema<IAccessToken>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },

    // Link state
    is_expired: {
      type: Boolean,
      default: false,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    play_started_at: {
      type: Date,
    },

    // View counts
    monthly_views: {
      type: Number,
      default: 0,
    },
    yearly_views: {
      type: Number,
      default: 0,
    },

    // Reset tracking
    last_monthly_reset: {
      type: Date,
      default: Date.now,
    },
    last_yearly_reset: {
      type: Date,
      default: Date.now,
    },

    last_viewed_at: {
      type: Date,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'access_tokens',
  },
);

const AccessToken: Model<IAccessToken> =
  mongoose.models.AccessToken ??
  mongoose.model<IAccessToken>('AccessToken', AccessTokenSchema);

export default AccessToken;
