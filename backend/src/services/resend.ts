import { Resend } from 'resend';
import { env, isResendConfigured } from '../config/env';
import { BookingRecord } from './supabase';

const resendClient = isResendConfigured()
  ? new Resend(env.RESEND_API_KEY)
  : null;

export const sendBookingNotificationEmails = async (
  booking: BookingRecord
) => {
  // =========================================================
  // STUDIO NOTIFICATION EMAIL
  // =========================================================

  const studioHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #090909; color: #F8F8F8; margin: 0; padding: 20px; }
          .card { background-color: #141414; border: 1px solid #FF7A00; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
          .header { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px; }
          .brand { color: #FF7A00; font-size: 24px; font-weight: bold; }
          .title { font-size: 20px; font-weight: 600; color: #FFFFFF; margin-top: 8px; }
          .badge { background: rgba(255,122,0,0.15); color: #FF7A00; padding: 4px 12px; border-radius: 999px; font-size: 14px; display: inline-block; }
          .field-row { margin-bottom: 12px; display: flex; flex-wrap: wrap; }
          .label { font-weight: bold; color: #A1A1A1; width: 180px; }
          .value { color: #F8F8F8; flex: 1; }
          .description-box { background: #090909; padding: 16px; border-radius: 8px; border-left: 3px solid #FF7A00; margin-top: 12px; font-size: 14px; white-space: pre-wrap; }
          .footer { margin-top: 24px; font-size: 12px; color: #737373; text-align: center; }
        </style>
      </head>

      <body>
        <div class="card">

          <div class="header">
            <div class="brand">YourStop Studio</div>
            <div class="title">🚨 New Project Booking Received</div>

            <p>
              <span class="badge">
                ID: ${booking.booking_id}
              </span>
            </p>
          </div>

          <div class="field-row">
            <span class="label">Customer Name:</span>
            <span class="value">
              <strong>${booking.customer_name}</strong>
            </span>
          </div>

          <div class="field-row">
            <span class="label">Business / Org:</span>
            <span class="value">
              ${booking.business_name || 'N/A'}
            </span>
          </div>

          <div class="field-row">
            <span class="label">Email:</span>

            <span class="value">
              <a
                href="mailto:${booking.email}"
                style="color: #FF7A00;"
              >
                ${booking.email}
              </a>
            </span>
          </div>

          <div class="field-row">
            <span class="label">Phone:</span>
            <span class="value">${booking.phone}</span>
          </div>

          <div class="field-row">
            <span class="label">WhatsApp:</span>
            <span class="value">
              ${booking.whatsapp || 'N/A'}
            </span>
          </div>

          <div class="field-row">
            <span class="label">Instagram:</span>
            <span class="value">
              ${booking.instagram_handle || 'N/A'}
            </span>
          </div>

          <div class="field-row">
            <span class="label">Selected Service:</span>
            <span class="value">
              <strong>${booking.selected_service}</strong>
            </span>
          </div>

          <div class="field-row">
            <span class="label">Budget:</span>
            <span class="value">${booking.budget}</span>
          </div>

          <div class="field-row">
            <span class="label">Target Deadline:</span>
            <span class="value">${booking.deadline}</span>
          </div>

          <div class="field-row">
            <span class="label">Preferred Channel:</span>
            <span class="value">
              ${booking.preferred_communication}
            </span>
          </div>

          ${
            booking.reference_file_name
              ? `
                <div class="field-row">
                  <span class="label">Attached File:</span>
                  <span class="value">
                    ${booking.reference_file_name}
                  </span>
                </div>
              `
              : ''
          }

          <div style="margin-top: 16px;">
            <span class="label">Project Description:</span>

            <div class="description-box">
              ${booking.project_description}
            </div>
          </div>

          <div class="footer">
            Received at
            ${new Date(booking.created_at).toLocaleString()}
            • YourStop Studio Notification Engine
          </div>

        </div>
      </body>
    </html>
  `;

  // =========================================================
  // CUSTOMER CONFIRMATION EMAIL
  // =========================================================

  const customerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">

        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #090909; color: #F8F8F8; margin: 0; padding: 20px; }

          .card {
            background-color: #141414;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 32px;
            max-width: 600px;
            margin: 0 auto;
            text-align: left;
          }

          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #FF7A00;
            letter-spacing: -0.5px;
          }

          .motto {
            color: #A1A1A1;
            font-size: 13px;
            margin-top: 2px;
          }

          h2 {
            color: #FFFFFF;
            font-size: 22px;
            margin-top: 24px;
          }

          p {
            color: #D4D4D4;
            line-height: 1.6;
            font-size: 15px;
          }

          li {
            color: #D4D4D4;
            line-height: 1.7;
            font-size: 15px;
          }

          .highlight-box {
            background: rgba(255,122,0,0.1);
            border: 1px solid rgba(255,122,0,0.3);
            padding: 16px 20px;
            border-radius: 8px;
            margin: 20px 0;
          }

          .booking-code {
            font-size: 20px;
            font-weight: bold;
            color: #FF7A00;
            font-family: monospace;
            letter-spacing: 1px;
          }

          .cta-btn {
            display: inline-block;
            background-color: #FF7A00;
            color: #FFFFFF;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin-top: 16px;
          }

          .footer {
            margin-top: 32px;
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 16px;
            font-size: 13px;
            color: #737373;
            text-align: center;
          }
        </style>
      </head>

      <body>

        <div class="card">

          <div class="logo">
            YourStop Studio
          </div>

          <div class="motto">
            We Write • We Design • We Build.
          </div>

          <h2>
            Thank you, ${booking.customer_name}!
          </h2>

          <p>
            We’ve received your project booking request for
            <strong>${booking.selected_service}</strong>.
            Our team is currently reviewing your details and requirements.
          </p>

          <div class="highlight-box">

            <div
              style="
                font-size: 12px;
                color: #A1A1A1;
                text-transform: uppercase;
              "
            >
              Your Booking Reference ID
            </div>

            <div class="booking-code">
              ${booking.booking_id}
            </div>

          </div>

          <p>
            <strong>Next Steps:</strong>
          </p>

          <ul>
            <li>
              Our creative & tech leads will analyze your project
              description and scope.
            </li>

            <li>
              We will get in touch via
              <strong>${booking.preferred_communication}</strong>
              within 12–24 business hours to discuss timeline and proposal.
            </li>
          </ul>

          <p>
            If you have any immediate updates or extra references,
            feel free to reply directly to this email or chat with
            us on WhatsApp.
          </p>

          <a
            href="https://wa.me/917995481098?text=Hi%20YourStop%20Studio,%20I'm%20following%20up%20on%20my%20booking%20${booking.booking_id}"
            class="cta-btn"
          >
            Chat on WhatsApp
          </a>

          <div class="footer">

            YourStop Studio • Transforming Ideas Into Powerful Digital Experiences

            <br>

            Email:
            <a
              href="mailto:yourstopstudio@gmail.com"
              style="color: #A1A1A1;"
            >
              yourstopstudio@gmail.com
            </a>

            |

            Instagram: @yourstop.studio

          </div>

        </div>

      </body>
    </html>
  `;

  // =========================================================
  // RESEND EMAIL DISPATCH
  // =========================================================

  if (!resendClient) {
    console.warn(
      `[Resend] Email sending disabled. Check RESEND_API_KEY configuration.`
    );

    return {
      success: false,
      simulated: true,
    };
  }

  try {
    // ---------------------------------------------------------
    // 1. SEND NEW BOOKING NOTIFICATION TO YOURSTOP STUDIO
    // ---------------------------------------------------------

    console.log(
      `[Resend] Sending studio notification to ${env.STUDIO_RECIPIENT_EMAIL}...`
    );

    const studioResult = await resendClient.emails.send({
      from: env.RESEND_FROM_EMAIL,

      to: [env.STUDIO_RECIPIENT_EMAIL],

      // Replying to this email will reply directly to the customer.
      replyTo: booking.email,

      subject:
        `🚨 [New Booking] ${booking.booking_id} - ` +
        `${booking.customer_name} (${booking.selected_service})`,

      html: studioHtml,
    });

    if (studioResult.error) {
      console.error(
        '[Resend] Studio notification failed:',
        studioResult.error
      );
    } else {
      console.log(
        `[Resend] Studio notification sent successfully. ID:`,
        studioResult.data?.id
      );
    }

    // ---------------------------------------------------------
    // 2. SEND BOOKING CONFIRMATION TO CUSTOMER
    // ---------------------------------------------------------

    console.log(
      `[Resend] Sending customer confirmation to ${booking.email}...`
    );

    const customerResult = await resendClient.emails.send({
      from: env.RESEND_FROM_EMAIL,

      // IMPORTANT:
      // Confirmation goes to the person who booked the service.
      to: [booking.email],

      // If the customer replies, the response goes to your Gmail.
      replyTo: env.STUDIO_RECIPIENT_EMAIL,

      subject:
        `We've received your request — YourStop Studio | ` +
        `${booking.booking_id}`,

      html: customerHtml,
    });

    if (customerResult.error) {
      console.error(
        '[Resend] Customer confirmation failed:',
        customerResult.error
      );
    } else {
      console.log(
        `[Resend] Customer confirmation sent successfully to ${booking.email}. ID:`,
        customerResult.data?.id
      );
    }

    // ---------------------------------------------------------
    // CHECK IF EITHER EMAIL FAILED
    // ---------------------------------------------------------

    if (studioResult.error || customerResult.error) {
      return {
        success: false,
        studioError: studioResult.error || null,
        customerError: customerResult.error || null,
      };
    }

    console.log(
      `[Resend] Successfully dispatched all emails for booking ${booking.booking_id}`
    );

    return {
      success: true,
      studioEmailId: studioResult.data?.id,
      customerEmailId: customerResult.data?.id,
    };
  } catch (error: any) {
    console.error(
      '[Resend] Unexpected error:',
      error?.message || error
    );

    return {
      success: false,
      error: error?.message || 'Unknown Resend error',
    };
  }
};