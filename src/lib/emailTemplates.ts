
type MaybeDate = Date | string | undefined;

function formatDateTime(value: MaybeDate): string | undefined {
  if (!value) return undefined;
  try {
    const d = typeof value === "string" ? new Date(value) : value;
    if (isNaN(d.getTime())) return undefined;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return undefined;
  }
}

export interface WelcomeEmailParams {
  fullName?: string;
  supportEmail?: string;
}

export function welcomeEmail(params: WelcomeEmailParams) {
  const name = params.fullName || "there";
  const supportEmail = params.supportEmail || "support@example.com";
  let websiteUrl = "https://Furnishcare.com";

  const subject = `Welcome to FurnishCare — Your Furniture's peace of mind`;
  const button = websiteUrl
    ? `
      <tr>
        <td style="padding-top:32px;text-align:center">
          <a href="${websiteUrl}" style="display:block;width:100%;max-width:320px;box-sizing:border-box;margin:0 auto;text-align:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 15px rgba(102, 126, 234, 0.4);transition:all 0.3s ease">
            Go to website →
          </a>
        </td>
      </tr>`
    : "";

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
      <tr>
        <td align="center" style="padding:0;margin:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
                <div style="text-align:center;padding:24px 0;border-bottom:3px solid #667eea">
                  <h1 style="margin:0 0 12px 0;color:#1a202c;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                    Hi, ${name}! 👋
                  </h1>
                </div>
                
                <div style="padding:24px 0">
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    Thank you for joining <strong style="color:#667eea">FurnishCare</strong> where the fine furniture gets the care it deserves.
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    We know how much your furniture means to you the craftsmanship, the comfort, the story behind every piece. Our job is simple: to keep those pieces looking beautiful and lasting longer.
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    From scratches and scuffs to water rings and loose joints, our specialists restore beauty and extend the life of the furniture you love.
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    You can schedule an appointment anytime through your account or by reaching us directly. Think of us as your personal furniture care team — always nearby, always available.
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    Welcome to peace of mind.
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    Warm Regards
                  </p>
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    The FurnishCare Team
                  </p>
                  
                  <p style="margin:0 0 16px 0;color:#2d3748;font-size:16px;line-height:1.7">
                    "Because fine furniture deserves lasting care"
                  </p>
                  
                  <div style="background:linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);border-left:4px solid #667eea;border-radius:8px;padding:24px;margin:24px 0">
                    <h3 style="margin:0 0 16px 0;color:#1a202c;font-size:18px;font-weight:600">
                      🚀 What can you do next?
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                          ✓ <strong>Browse our care plans</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                          ✓ <strong>Buy a subscription</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                          ✓ <strong>Book your first appointment</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                          ✓ <strong>Relax — we’ll handle the rest</strong>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${button}
                </table>
                
                <div style="margin-top:24px;padding-top:16px;border-top:2px solid #e2e8f0;text-align:center">
                  <p style="margin:0;color:#718096;font-size:14px;line-height:1.6">
                    Need help? We're here for you!<br>
                    <a href="mailto:${supportEmail}" style="color:#667eea;text-decoration:none;font-weight:600">${supportEmail}</a>
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return { subject, html };
}

export interface SubscriptionEmailParams {
  fullName?: string;
  planName: string;
  price?: string;
  serviceStartTime?: MaybeDate;
  serviceEndTime?: MaybeDate;
}

export function subscriptionPurchaseEmail(params: SubscriptionEmailParams) {
  const name = params.fullName || "there";
  const subject = `Your FurnishCare ${params.planName} Membership Is Active`;
  const start = formatDateTime(params.serviceStartTime);
  const end = formatDateTime(params.serviceEndTime);
  const dashboardUrl = "https://furnishcare.com/dashboard";
  const manageLink = "https://furnishcare.com/dashboard";

  const rows: string[] = [];
  rows.push(`<tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600;width:40%">Plan</td><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#1a202c;font-size:15px;font-weight:600">${params.planName}</td></tr>`);
  if (params.price) rows.push(`<tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600">Price</td><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#1a202c;font-size:15px"><span style="color:#10b981;font-weight:700;font-size:18px">$${params.price}</span> <span style="color:#718096">/month</span></td></tr>`);
  if (start) rows.push(`<tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600">Start Date</td><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#1a202c;font-size:15px">${start}</td></tr>`);
  if (end) rows.push(`<tr><td style="padding:12px 16px;color:#4a5568;font-size:14px;font-weight:600">End Date</td><td style="padding:12px 16px;color:#1a202c;font-size:15px">${end}</td></tr>`);

  const manage = manageLink
    ? `<a href="${manageLink}" style="display:block;width:100%;max-width:320px;box-sizing:border-box;margin:0 auto;background:#ffffff;color:#667eea;padding:14px 32px;border:2px solid #667eea;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;transition:all 0.3s ease;text-align:center">Manage Subscription</a>`
    : "";
  const dashboardBtn = dashboardUrl
    ? `<a href="${dashboardUrl}" style="display:block;width:100%;max-width:320px;box-sizing:border-box;margin:0 auto;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 15px rgba(102, 126, 234, 0.4);transition:all 0.3s ease;text-align:center">Open Dashboard →</a>`
    : "";

  const html = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
    <tr>
      <td align="center" style="padding:0;margin:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
              <div style="text-align:center; padding:24px 0; border-bottom:3px solid #10b981;">
                <div
                  style="
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    
                    width:80px;
                    height:80px;
                    
                    margin:0 auto 16px auto;
                    font-size:28px;
                  "
                >
                  🎉
                </div>

                <h1 style="margin:0 0 8px 0; color:#1a202c; font-size:28px; font-weight:700; letter-spacing:-0.5px;">
                  Thanks for your purchase, ${name}!
                </h1>
                <p style="margin:0; color:#10b981; font-size:16px; font-weight:600;">
                  Your subscription is now active
                </p>
              </div>

              <div style="padding:24px 0;">
                <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                  Your <strong style="color:#667eea;">FurnishCare</strong> subscription is now active, which means your furniture is in good hands.
                </p>

                <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                  Here’s what that means for you:
                </p>

                <ul style="list-style:none; padding:0; margin:0 0 24px 0; text-align:left; display:inline-block;">
                  <li style="margin-bottom:8px;">• Whenever your furniture needs touch-ups or repairs, simply book an appointment.</li>
                  <li style="margin-bottom:8px;">• Our skilled technicians handle everything with precision and respect for your home.</li>
                  <li>• You’ll always have priority access and transparent service — no surprises, just care that lasts.</li>
                </ul>

                <div
                  style="
                    background:#ffffff;
                    border:2px solid #e2e8f0;
                    border-radius:12px;
                    overflow:hidden;
                    margin:24px 0;
                    box-shadow:0 2px 8px rgba(0,0,0,0.05);
                  "
                >
                  <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding:16px; text-align:center;">
                    <h3 style="margin:0; color:#ffffff; font-size:18px; font-weight:600;">
                      📋 Your Plan Details
                    </h3>
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                  >
                    <tbody>
                      ${rows.join("")}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style="text-align:center; padding:24px 0;">
                ${dashboardBtn}
              </div>

              <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                We’ll reach out shortly to confirm your first visit or answer any questions you may have.
              </p>

              <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                Thank you for trusting FurnishCare to protect the beauty and comfort of your home.
              </p>

              <p style="margin:0 0 4px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                Warm Regards,
              </p>
              <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; line-height:1.7; text-align:center;">
                The FurnishCare Team
              </p>

              <p style="margin:0 0 24px 0; color:#2d3748; font-size:16px; font-style:italic; line-height:1.7; text-align:center;">
                “When your furniture needs care, we’ll be there.”
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

  return { subject, html };
}

export interface BookingAcknowledgementParams {
  fullName?: string;
  bookingId?: string;
  date?: MaybeDate; // date/time combined or date
  time?: string; // optional human time if date only provided
  address?: string;
}

export function bookingAcknowledgementEmail(params: BookingAcknowledgementParams) {
  const name = params.fullName || "there";
  const subject = `Your FurnishCare Appointment Is Confirmed`;
  const when = formatDateTime(params.date) || [params.date, params.time].filter(Boolean).join(" ") || undefined;
  const dashboardUrl = "https://furnishcare.com/dashboard";

  const rows: string[] = [];
  if (params.bookingId) rows.push(`<tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600;width:35%">Booking ID</td><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#667eea;font-size:15px;font-weight:700">#${params.bookingId}</td></tr>`);
  if (when) rows.push(`<tr><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600">Date & Time</td><td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#1a202c;font-size:15px;font-weight:600" ${when}</td></tr>`);
  if (params.address) rows.push(`<tr><td style="padding:12px 16px;color:#4a5568;font-size:14px;font-weight:600">Address</td><td style="padding:12px 16px;color:#1a202c;font-size:15px">📍 ${params.address}</td></tr>`);


  const dashboardBtn = dashboardUrl
    ? `<a href="${dashboardUrl}" style="display:block;width:100%;max-width:320px;box-sizing:border-box;margin:0 auto;text-align:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#ffffff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;box-shadow:0 4px 15px rgba(102, 126, 234, 0.4);transition:all 0.3s ease">View Booking Details →</a>`
    : "";

  const html = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
    <tr>
      <td align="center" style="padding:0;margin:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
              <div style="text-align:center; padding:24px 0; border-bottom:3px solid #10b981;">
               <div
  style="
    text-align:center;
    width:72px;
    height:72px;
    margin:0 auto 16px auto;
    border-radius:50%;
    background:linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow:0 4px 12px rgba(0, 0, 0, 0.1);
    line-height:72px; /* centers vertically */
  "
>
  <span
    style="
      font-size:32px;
      color:#ffffff;
      font-weight:bold;
      vertical-align:middle;
    "
  >
    ✅
  </span>
</div>


                <h1
                  style="
                    margin:0 0 8px 0;
                    color:#1a202c;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:-0.5px;
                  "
                >
                  You're all set, ${name}!
                </h1>
              </div>

              <div style="padding:24px 0;">
                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:20px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  Hi ${name}, your appointment is confirmed!
                </p>

                <div
                  style="
                    background:#ffffff;
                    border:2px solid #e2e8f0;
                    border-radius:12px;
                    overflow:hidden;
                    margin:24px 0;
                    box-shadow:0 2px 8px rgba(0,0,0,0.05);
                  "
                >
                  <div
                    style="
                      background:linear-gradient(135deg, #10b981 0%, #059669 100%);
                      padding:16px;
                      text-align:center;
                    "
                  >
                    <h3
                      style="
                        margin:0;
                        color:#ffffff;
                        font-size:18px;
                        font-weight:600;
                      "
                    >
                       Your Booking Details
                    </h3>
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="border-collapse:collapse;"
                  >
                    <tbody>
                      ${rows.join("")}
                    </tbody>
                  </table>
                </div>

                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:16px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  Before we arrive, please make sure the area around your furniture is accessible.
                  We’ll take care of the rest — tools, materials, and expert craftsmanship.
                </p>

                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:16px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  If you need to adjust your time or have special requests, send an email to
                  <a
                    href="mailto:support@furnishcare.com"
                    style="color:#10b981; text-decoration:none; font-weight:600;"
                  >
                    support@furnishcare.com
                  </a>
                  with your relevant details.
                </p>

                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:16px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  We look forward to restoring your furniture’s beauty.
                </p>

                <p
                  style="
                    margin:0 0 8px 0;
                    color:#2d3748;
                    font-size:16px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  Warmly,
                </p>

                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:16px;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  The FurnishCare Team
                </p>

                <p
                  style="
                    margin:0 0 24px 0;
                    color:#2d3748;
                    font-size:16px;
                    font-style:italic;
                    line-height:1.7;
                    text-align:center;
                  "
                >
                  “Furniture care, made effortless.”
                </p>

                <div style="text-align:center; padding:24px 0;">
                  ${dashboardBtn}
                </div>

                <div
                  style="
                    margin-top:32px;
                    padding-top:24px;
                    border-top:2px solid #e2e8f0;
                    text-align:center;
                  "
                >
                  <p
                    style="
                      margin:0;
                      color:#718096;
                      font-size:14px;
                      line-height:1.6;
                    "
                  >
                    Have specific concerns<br>
                    <a
                      href="mailto:support@furnishcare.com"
                      style="color:#667eea; text-decoration:none; font-weight:600;"
                    >
                      support@furnishcare.com
                    </a>
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;


  return { subject, html };
}


export interface SubscriptionEndingParams {
  fullName?: string;
  remainingDays: number;
  planName?: string;
  dashboardUrl?: string;
  supportEmail?: string;
}

export function subscriptionEndingEmail(params: SubscriptionEndingParams) {
  const name = params.fullName || "there";
  const remainingDays = params.remainingDays;
  const planName = params.planName || "your subscription";
  const dashboardUrl = params.dashboardUrl || "https://furnishcare.com/dashboard";
  const supportEmail = params.supportEmail || "support@furnishcare.com";

  const subject = `Your FurnishCare subscription expires in ${remainingDays} day${remainingDays === 1 ? '' : 's'}`;

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
      <tr>
        <td align="center" style="padding:0;margin:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
                <div style="text-align:center;padding:24px 0;border-bottom:3px solid #f59e0b">
                  <div style="display:inline-block;background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);width:64px;height:64px;border-radius:50%;margin-bottom:16px;padding:16px">
                    <span style="font-size:32px;line-height:32px">⏰</span>
                  </div>
                  <h1 style="margin:0 0 8px 0;color:#1a202c;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                    Your subscription expires soon, ${name}!
                  </h1>
                  <p style="margin:0;color:#f59e0b;font-size:18px;font-weight:600">Only ${remainingDays} day${remainingDays === 1 ? '' : 's'} remaining</p>
                </div>
                
                <div style="padding:24px 0">
                  <p style="margin:0 0 24px 0;color:#2d3748;font-size:16px;line-height:1.7;text-align:center">
                    Your <strong style="color:#667eea">FurnishCare</strong> ${planName} will expire in <strong style="color:#f59e0b">${remainingDays} day${remainingDays === 1 ? '' : 's'}</strong>. Don't let your furniture lose its shine!
                  </p>
                  
                  <div style="background:linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);border-left:4px solid #f59e0b;border-radius:8px;padding:24px;margin:24px 0">
                    <h3 style="margin:0 0 16px 0;color:#78350f;font-size:18px;font-weight:600">
                      🚨 Why choose us?
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:#78350f;font-size:15px;line-height:1.6">
                          ✓ <strong>Keep your furniture looking pristine</strong> with regular touchups
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#78350f;font-size:15px;line-height:1.6">
                          ✓ <strong>Maintain furniture value</strong> with professional care
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#78350f;font-size:15px;line-height:1.6">
                          ✓ <strong>Convenient scheduling</strong> that fits your lifestyle
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="background:#ffffff;border:2px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:24px 0;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
                    <div style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%);padding:16px;text-align:center">
                      <h3 style="margin:0;color:#ffffff;font-size:18px;font-weight:600">
                        ⏳ Subscription Status
                      </h3>
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                      <tbody>
                        <tr>
                          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#4a5568;font-size:14px;font-weight:600;width:40%">Plan</td>
                          <td style="padding:12px 16px;border-bottom:1px solid #e2e8f0;color:#1a202c;font-size:15px;font-weight:600">${planName}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px;color:#4a5568;font-size:14px;font-weight:600">Days Remaining</td>
                          <td style="padding:12px 16px;color:#f59e0b;font-size:15px;font-weight:700">${remainingDays} day${remainingDays === 1 ? '' : 's'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div style="margin-top:24px;padding-top:16px;border-top:2px solid #e2e8f0;text-align:center">
                  <p style="margin:0;color:#718096;font-size:14px;line-height:1.6">
                   Need more help?<br>
                    <a href="mailto:${supportEmail}" style="color:#667eea;text-decoration:none;font-weight:600">${supportEmail}</a>
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return { subject, html };
}

export interface SubscriptionExpiredParams {
  fullName?: string;
  planName?: string;
  supportEmail?: string;
}

export function subscriptionExpiredEmail(params: SubscriptionExpiredParams) {
  const name = params.fullName || "there";
  const planName = params.planName || "your subscription";
  const supportEmail = params.supportEmail || "support@furnishcare.com";

  const subject = `Your FurnishCare subscription has expired - Renew now to keep your furniture looking great!`;
  const renewBtn = `
    <tr>
      <td style="padding-top:32px;text-align:center">
        <a href="https://furnishcare.com/pricing" style="display:block;width:100%;max-width:320px;box-sizing:border-box;margin:0 auto;text-align:center;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;box-shadow:0 4px 15px rgba(102, 126, 234, 0.4);transition:all 0.3s ease">
          View Pricing Plans →
        </a>
      </td>
    </tr>`;

  const html = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
      <tr>
        <td align="center" style="padding:0;margin:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
                <div style="text-align:center;padding:24px 0;border-bottom:3px solid #ef4444">
                  <h1 style="margin:0 0 8px 0;color:#1a202c;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                    Your subscription has expired, ${name}
                  </h1>
                  <p style="margin:0;color:#ef4444;font-size:18px;font-weight:600">But we miss you already!</p>
                </div>
                
                <div style="padding:24px 0">
                  <p style="margin:0 0 24px 0;color:#2d3748;font-size:16px;line-height:1.7;text-align:center">
                    Your <strong style="color:#667eea">FurnishCare</strong> ${planName} has expired, but your furniture still needs that professional touch. Don't let scratches and wear take over!
                  </p>
                  
                  <div style="background:linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);border-left:4px solid #ef4444;border-radius:8px;padding:24px;margin:24px 0">
                    <h3 style="margin:0 0 16px 0;color:#991b1b;font-size:18px;font-weight:600">
                      😢 What you're missing out on:
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;color:#991b1b;font-size:15px;line-height:1.6">
                          ✗ <strong>Professional touchups</strong> to keep furniture looking new
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#991b1b;font-size:15px;line-height:1.6">
                          ✗ <strong>Regular maintenance</strong> that extends furniture life
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;color:#991b1b;font-size:15px;line-height:1.6">
                          ✗ <strong>Convenient scheduling</strong> that fits your busy life
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="background:#ffffff;border:2px solid #e2e8f0;border-radius:12px;overflow:hidden;margin:24px 0;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
                    <div style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);padding:16px;text-align:center">
                      <h3 style="margin:0;color:#ffffff;font-size:18px;font-weight:600">
                        💎 Why Choose FurnishCare?
                      </h3>
                    </div>
                    <div style="padding:20px">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                            ✓ <strong>Expert specialists</strong> with years of furniture care experience
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                            ✓ <strong>Flexible plans</strong> to match your needs and budget
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:8px 0;color:#2d3748;font-size:15px;line-height:1.6">
                            ✓ <strong>100% satisfaction</strong> guaranteed or your money back
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${renewBtn}
                </table>
                
                <div style="margin-top:24px;padding-top:16px;border-top:2px solid #e2e8f0;text-align:center">
                  <p style="margin:0;color:#718096;font-size:14px;line-height:1.6">
                    Ready to get back on track? We're here to help!<br>
                    <a href="mailto:${supportEmail}" style="color:#667eea;text-decoration:none;font-weight:600">${supportEmail}</a>
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  return { subject, html };
}

export interface CustomEmailParams {
  fullName?: string;
  bodyHtml: string;
  supportEmail?: string;
}

export function customEmail(params: CustomEmailParams) {
  const name = "there";
  const bodyHtml = params.bodyHtml;
  const supportEmail = "support@furnishcare.com";

  const html = `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7fafc;padding:16px 0;margin:0;width:100%;">
    <tr>
      <td align="center" style="padding:0;margin:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:20px 16px;font-family:Arial, sans-serif;color:#1a202c;">
              <div style="text-align:center; padding:24px 0; border-bottom:3px solid #667eea;">


                <h1
                  style="
                    margin:0 0 8px 0;
                    color:#1a202c;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:-0.5px;
                  "
                >
                  Hello, there!
                </h1>

                <p
                  style="
                    margin:0;
                    color:#667eea;
                    font-size:18px;
                    font-weight:500;
                  "
                >
                  From your friends at <strong>FurnishCare</strong>
                </p>
              </div>

              <div style="padding:24px 0;">
                <!-- Add your main email content here -->
                ${bodyHtml}
              </div>

              <div
                style="
                  margin-top:24px;
                  padding-top:16px;
                  border-top:2px solid #e2e8f0;
                  text-align:center;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#718096;
                    font-size:14px;
                    line-height:1.6;
                  "
                >
                  Questions? We're here to help!<br>
                  <a
                    href="mailto:${supportEmail}"
                    style="color:#667eea; text-decoration:none; font-weight:600;"
                  >
                    ${supportEmail}
                  </a>
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

  return { html };
}




