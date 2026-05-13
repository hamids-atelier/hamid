import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const TO_EMAIL = 'hamid54888@gmail.com'
const FROM_EMAIL = 'connect@hamidsharifi.com'
const FROM_NAME = "Hamid's Atelier"

const SERVICE_LABELS: Record<string, string> = {
  branding: 'Branding',
  uiux: 'UI/UX Design',
  webdesign: 'Web Design',
  webdev: 'Web Development',
  fullpackage: 'Full Package',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, service, firstName, lastName, email, howFound, pageUrl } = body

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'Unknown'

    const city    = decodeURIComponent(request.headers.get('x-vercel-ip-city') ?? '')
    const region  = request.headers.get('x-vercel-ip-country-region') ?? ''
    const country = request.headers.get('x-vercel-ip-country') ?? ''
    const location = [city, region, country].filter(Boolean).join(', ') || 'Unknown'

    /* ── 1. Verify reCAPTCHA v3 ── */
    if (!token) {
      return NextResponse.json({ error: 'reCAPTCHA token missing.' }, { status: 400 })
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY ?? '',
        response: token,
      }),
    })

    const verifyData = await verifyRes.json()

    if (!verifyData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    if ((verifyData.score ?? 0) < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA score too low. Please try again.' },
        { status: 400 }
      )
    }

    /* ── 2. Build transporter ── */
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim()
    const serviceLabel = SERVICE_LABELS[service] ?? service ?? 'Not specified'

    /* ═══════════════════════════════════════════════════════
       EMAIL 1 — Notification to Hamid
    ═══════════════════════════════════════════════════════ */
    const notificationHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#111;padding:32px 40px;">
            <p style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">HAMID</p>
            <p style="margin:6px 0 0;color:#888;font-size:13px;">New client inquiry from <a href="https://hamidsharifi.com" style="color:#888;text-decoration:none;">hamidsharifi.com</a></p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111;">You have a new inquiry 🎉</p>
            <p style="margin:0 0 28px;font-size:14px;color:#6b7280;">Submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <!-- Service badge -->
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;">Service requested</p>
            <p style="margin:0 0 28px;">
              <span style="display:inline-block;background:#E8432D;color:#fff;font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;">${serviceLabel}</span>
            </p>

            <!-- Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:32px;">
              <tr style="background:#fafafa;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;border-bottom:1px solid #f0f0f0;">Full name</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;">${fullName || '—'}</td>
              </tr>
              <tr style="background:#fff;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;border-bottom:1px solid #f0f0f0;">Email</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email ?? ''}" style="color:#E8432D;text-decoration:none;">${email || '—'}</a></td>
              </tr>
              <tr style="background:#fafafa;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;border-bottom:1px solid #f0f0f0;">How they found you</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;">${howFound || '—'}</td>
              </tr>
              <tr style="background:#fff;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;border-bottom:1px solid #f0f0f0;">Location</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;">${location}</td>
              </tr>
              <tr style="background:#fafafa;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;border-bottom:1px solid #f0f0f0;">IP Address</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;font-family:monospace;border-bottom:1px solid #f0f0f0;">${ip}</td>
              </tr>
              <tr style="background:#fff;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;width:36%;">Page URL</td>
                <td style="padding:14px 18px;font-size:14px;color:#111;word-break:break-all;"><a href="${pageUrl || '#'}" style="color:#E8432D;text-decoration:none;">${pageUrl || '—'}</a></td>
              </tr>
            </table>

            <!-- CTA -->
            <p style="margin:0;text-align:center;">
              <a href="mailto:${email ?? ''}"
                 style="display:inline-block;background:#111;color:#fff;font-size:13px;font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.04em;">
                Reply to ${firstName ?? 'this client'} →
              </a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:18px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Sent from <strong>hamidsharifi.com</strong> · <a href="mailto:connect@hamidsharifi.com" style="color:#9ca3af;text-decoration:none;">connect@hamidsharifi.com</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    /* ═══════════════════════════════════════════════════════
       EMAIL 2 — Auto-reply to the client
    ═══════════════════════════════════════════════════════ */
    const autoReplyHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#111;padding:32px 40px;">
            <p style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">HAMID</p>
            <p style="margin:6px 0 0;color:#888;font-size:13px;"><a href="https://hamidsharifi.com" style="color:#888;text-decoration:none;">hamidsharifi.com</a> · <a href="mailto:connect@hamidsharifi.com" style="color:#888;text-decoration:none;">connect@hamidsharifi.com</a></p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 36px;">
            <p style="margin:0 0 20px;font-size:20px;font-weight:800;color:#111;">
              Hi ${firstName ?? 'there'}, thank you for reaching out! 👋
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
              I've received your inquiry about <strong>${serviceLabel}</strong> and I'm excited to learn more about your project.
            </p>
            <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.7;">
              I personally review every submission and will get back to you within <strong>24 hours</strong> to discuss how I can help bring your vision to life.
            </p>
            <p style="margin:0 0 32px;font-size:14px;color:#374151;line-height:1.7;">
              In the meantime, feel free to browse my portfolio or reach out directly if you have any urgent questions.
            </p>

            <!-- Summary box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:32px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Your submission summary</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#374151;"><strong>Name:</strong> ${fullName || '—'}</p>
                  <p style="margin:0 0 6px;font-size:13px;color:#374151;"><strong>Service:</strong> ${serviceLabel}</p>
                  <p style="margin:0;font-size:13px;color:#374151;"><strong>Email:</strong> ${email || '—'}</p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <p style="margin:0;text-align:center;">
              <a href="https://hamidsharifi.com"
                 style="display:inline-block;background:#E8432D;color:#fff;font-size:13px;font-weight:700;padding:14px 36px;border-radius:6px;text-decoration:none;letter-spacing:0.04em;">
                Visit hamidsharifi.com
              </a>
            </p>
          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:0 40px 36px;">
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">
              Warm regards,<br/>
              <strong>Hamid Sharifi</strong><br/>
              <span style="color:#6b7280;font-size:13px;">Designer &amp; Developer · Winston-Salem, NC</span><br/>
              <a href="mailto:connect@hamidsharifi.com" style="color:#E8432D;font-size:13px;text-decoration:none;">connect@hamidsharifi.com</a> &nbsp;·&nbsp;
              <a href="tel:3369263255" style="color:#E8432D;font-size:13px;text-decoration:none;">(336) 926-3255</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:18px 40px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              You're receiving this because you submitted a form at <a href="https://hamidsharifi.com" style="color:#9ca3af;text-decoration:none;"><strong>hamidsharifi.com</strong></a>.<br/>
              If this wasn't you, please ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    /* ── 3. Send both emails in parallel ── */
    await Promise.all([
      transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: TO_EMAIL,
        replyTo: email,
        subject: `New inquiry: ${serviceLabel} — ${fullName}`,
        html: notificationHtml,
      }),
      transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: email,
        subject: `Got your message, ${firstName ?? 'there'}! I'll be in touch soon.`,
        html: autoReplyHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
