import crypto from 'crypto';

const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
const API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const VIDEO_ID = process.env.BUNNY_VIDEO_ID!;
const SIGNING_KEY = process.env.BUNNY_SIGNING_KEY!;

// How long the signed URL stays valid (in seconds)
// Matches PLAY_EXPIRY_MINUTES (45 min) + small buffer
const URL_EXPIRY_SECONDS = 60 * 60; // 60 minutes

/* ─── Generate a signed Bunny.net embed URL ─── */
export function generateBunnySignedUrl(): {
  embedUrl: string;
  expiresAt: Date;
} {
  const expiresAt = new Date(Date.now() + URL_EXPIRY_SECONDS * 1000);
  const expiresUnix = Math.floor(expiresAt.getTime() / 1000);

  // Bunny signing: SHA256( signing_key + video_id + expiry_time )
  const signature = crypto
    .createHash('sha256')
    .update(SIGNING_KEY + VIDEO_ID + expiresUnix)
    .digest('hex');

  // Bunny Stream embed URL with token auth
  const embedUrl =
    `https://player.mediadelivery.net/embed/${LIBRARY_ID}/${VIDEO_ID}` +
    `?token=${signature}&expires=${expiresUnix}` +
    `&autoplay=false` +
    `&preload=false` +
    `&responsive=true`;

  return { embedUrl, expiresAt };
}

/* ─── Verify the library + video exist (optional health check) ─── */
export async function getBunnyVideoStatus(): Promise<boolean> {
  const res = await fetch(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${VIDEO_ID}`,
    {
      headers: {
        AccessKey: API_KEY,
        accept: 'application/json',
      },
    },
  );

  return res.ok;
}
