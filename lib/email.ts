import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

/* ─── Send access link after payment ─── */
export async function sendAccessEmail({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) {
  const watchUrl = `${APP_URL}/watch?token=${token}`;

  await resend.emails.send({
    from: `Plan B Pathfinder <${FROM}>`,
    to: email,
    replyTo: 'dmsupotplanb@gmail.com',
    subject: '🎯 Your Plan B Pathfinder Session — Access Link Inside',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',sans-serif;color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;padding:0 20px;">
            <tr>
              <td>
                <!-- Header -->
                <div style="text-align:center;margin-bottom:32px;">
                  <span style="font-size:1.4rem;font-weight:900;letter-spacing:-0.02em;">
                    PLAN <span style="color:#ff6b35;">B</span>
                  </span>
                </div>

                <!-- Card -->
                <div style="background:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px 32px;text-align:center;">
                  <p style="font-size:2rem;margin:0 0 8px;">🎯</p>
                  <h1 style="font-size:1.5rem;font-weight:900;margin:0 0 12px;line-height:1.2;">
                    You're In, ${name}!
                  </h1>
                  <p style="color:rgba(255,255,255,0.5);font-size:0.95rem;line-height:1.6;margin:0 0 32px;">
                    Your Plan B Pathfinder Session is ready.<br/>
                    Click the button below to start watching.
                  </p>

                  <!-- CTA Button -->
                  <a
                    href="${watchUrl}"
                    style="display:inline-block;background:#ff6b35;color:#ffffff;font-weight:900;font-size:1rem;padding:16px 40px;border-radius:14px;text-decoration:none;letter-spacing:0.01em;"
                  >
                    Watch Now →
                  </a>

                  <!-- Expiry note -->
                  <p style="color:rgba(255,255,255,0.25);font-size:0.75rem;margin:24px 0 0;line-height:1.6;">
                    This link is valid for <strong style="color:rgba(255,255,255,0.45);">24 hours</strong> and will expire in 60 minutes once you start watching.<br/>
                    Monthly limit: 3 views · Yearly limit: 15 views
                  </p>
                </div>

                <!-- Need help -->
                <div style="text-align:center;margin-top:24px;">
                  <p style="color:rgba(255,255,255,0.25);font-size:0.8rem;line-height:1.6;">
                    Lost your link? Visit
                    <a href="${APP_URL}/resend" style="color:#ff6b35;text-decoration:none;">${APP_URL}/resend</a>
                    to request a new one.<br/>
                    Need help? Contact us at <a href="mailto:dmsupotplanb@gmail.com" style="color:#ff6b35;text-decoration:none;">dmsupotplanb@gmail.com</a>.
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="color:rgba(255,255,255,0.18);font-size:0.75rem;margin:0;">
                    © ${new Date().getFullYear()} PLAN B · All sales final · Prices in INR
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

/* ─── Resend access link (user requested new link) ─── */
export async function sendResendEmail({
  email,
  token,
  monthlyRemaining,
  yearlyRemaining,
}: {
  email: string;
  token: string;
  monthlyRemaining: number;
  yearlyRemaining: number;
}) {
  const watchUrl = `${APP_URL}/watch?token=${token}`;

  await resend.emails.send({
    from: `Plan B Pathfinder <${FROM}>`,
    to: email,
    replyTo: 'dmsupotplanb@gmail.com',
    subject: '🔗 Your New Plan B Access Link',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="margin:0;padding:0;background:#0a0a0f;font-family:'DM Sans',sans-serif;color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;padding:0 20px;">
            <tr>
              <td>
                <!-- Header -->
                <div style="text-align:center;margin-bottom:32px;">
                  <span style="font-size:1.4rem;font-weight:900;letter-spacing:-0.02em;">
                    PLAN <span style="color:#ff6b35;">B</span>
                  </span>
                </div>

                <!-- Card -->
                <div style="background:#111118;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:40px 32px;text-align:center;">
                  <p style="font-size:2rem;margin:0 0 8px;">🔗</p>
                  <h1 style="font-size:1.4rem;font-weight:900;margin:0 0 12px;">
                    Here's your new access link
                  </h1>
                  <p style="color:rgba(255,255,255,0.5);font-size:0.95rem;line-height:1.6;margin:0 0 32px;">
                    Your previous link has been invalidated.<br/>
                    Use the button below to watch the session.
                  </p>

                  <a
                    href="${watchUrl}"
                    style="display:inline-block;background:#ff6b35;color:#ffffff;font-weight:900;font-size:1rem;padding:16px 40px;border-radius:14px;text-decoration:none;"
                  >
                    Watch Now →
                  </a>

                  <!-- Remaining views -->
                  <div style="margin-top:28px;padding:16px;background:rgba(255,107,53,0.08);border:1px solid rgba(255,107,53,0.2);border-radius:12px;">
                    <p style="color:rgba(255,255,255,0.55);font-size:0.8rem;margin:0;line-height:1.7;">
                      Views remaining this month: <strong style="color:#ff6b35;">${monthlyRemaining}</strong><br/>
                      Views remaining this year: <strong style="color:#ff6b35;">${yearlyRemaining}</strong>
                    </p>
                  </div>

                  <p style="color:rgba(255,255,255,0.25);font-size:0.75rem;margin:20px 0 0;">
                    Link expires in 60 minutes once you start watching.
                  </p>
                </div>

                <!-- Footer -->
                <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
                  <p style="color:rgba(255,255,255,0.18);font-size:0.75rem;margin:0;">
                    © ${new Date().getFullYear()} PLAN B · All sales final · Prices in INR
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
