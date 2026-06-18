/**
 * Provider-agnostic transactional email transport.
 *
 * Today this runs on Resend (Vercel). On AWS it switches to Amazon SES by
 * setting EMAIL_PROVIDER=ses — no code change. The SES SDK is imported lazily
 * so it's never bundled/loaded unless that path is actually used.
 *
 * Env:
 *   EXEC_FROM_EMAIL   (required, both providers) e.g. "Merkle Modern CRM <no-reply@merkle.com>"
 *   EMAIL_PROVIDER    "resend" (default) | "ses"
 *   RESEND_API_KEY    (resend only)
 *   AWS_REGION        (ses only) e.g. "us-east-1"
 *   AWS credentials   (ses only) — on App Runner/ECS these come from the
 *                     instance/task IAM role automatically; no keys in env.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export interface SendResult {
  sent: boolean;
  /** Set when not sent on purpose (provider not configured yet). */
  reason?: string;
  /** Set when a real send attempt failed. */
  error?: string;
}

export async function sendTransactionalEmail(
  input: SendEmailInput
): Promise<SendResult> {
  const from = process.env.EXEC_FROM_EMAIL;
  if (!from) return { sent: false, reason: "email_not_configured" };

  const provider = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
  return provider === "ses"
    ? sendViaSes(input, from)
    : sendViaResend(input, from);
}

async function sendViaResend(
  { to, subject, html }: SendEmailInput,
  from: string
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "email_not_configured" };

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[email] Resend error", res.status, detail.slice(0, 300));
    return { sent: false, error: "send_failed" };
  }
  return { sent: true };
}

async function sendViaSes(
  { to, subject, html }: SendEmailInput,
  from: string
): Promise<SendResult> {
  try {
    // Lazy import so the AWS SDK is only loaded when SES is the active provider.
    const { SESv2Client, SendEmailCommand } = await import(
      "@aws-sdk/client-sesv2"
    );
    const client = new SESv2Client({ region: process.env.AWS_REGION });
    await client.send(
      new SendEmailCommand({
        FromEmailAddress: from,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: "UTF-8" },
            Body: { Html: { Data: html, Charset: "UTF-8" } },
          },
        },
      })
    );
    return { sent: true };
  } catch (err) {
    console.error("[email] SES error", err);
    return { sent: false, error: "send_failed" };
  }
}
