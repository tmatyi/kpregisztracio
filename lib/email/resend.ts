import { Resend } from "resend";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface OrderConfirmationEmailProps {
  to: string;
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  participantCount: number;
  totalAmount: number;
  qrCodeUrl: string;
}

export async function sendOrderConfirmationEmail({
  to,
  orderNumber,
  eventTitle,
  eventDate,
  eventLocation,
  participantCount,
  totalAmount,
  qrCodeUrl,
}: OrderConfirmationEmailProps) {
  // Skip email sending if Resend is not configured
  if (!resend) {
    console.warn("Resend API key not configured, skipping email send");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Re-Generáció <onboarding@resend.dev>",
      to: [to],
      subject: `Rendelés megerősítés - ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .card h2 {
                margin-top: 0;
                color: #667eea;
                font-size: 18px;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .detail-label {
                color: #6b7280;
                font-weight: 500;
              }
              .detail-value {
                color: #111827;
                font-weight: 600;
              }
              .button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .success-icon {
                font-size: 48px;
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="success-icon">✓</div>
              <h1 style="margin: 0;">Sikeres vásárlás!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Köszönjük a rendelést</p>
            </div>
            
            <div class="content">
              <div class="card">
                <h2>📅 Esemény részletei</h2>
                <div class="detail-row">
                  <span class="detail-label">Esemény:</span>
                  <span class="detail-value">${eventTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Időpont:</span>
                  <span class="detail-value">${new Date(
                    eventDate,
                  ).toLocaleDateString("hu-HU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Helyszín:</span>
                  <span class="detail-value">${eventLocation}</span>
                </div>
              </div>

              <div class="card">
                <h2>🎫 Rendelés részletei</h2>
                <div class="detail-row">
                  <span class="detail-label">Rendelésszám:</span>
                  <span class="detail-value">${orderNumber.substring(0, 8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Résztvevők száma:</span>
                  <span class="detail-value">${participantCount} fő</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Fizetett összeg:</span>
                  <span class="detail-value">${new Intl.NumberFormat("hu-HU", {
                    style: "currency",
                    currency: "HUF",
                  }).format(totalAmount)}</span>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${qrCodeUrl}" class="button">
                  QR kód megtekintése
                </a>
                <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
                  Mutasd fel a QR kódot az esemény belépésénél
                </p>
              </div>

              <div class="card" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                  <strong>⚠️ Fontos:</strong> Kérjük, őrizd meg ezt az e-mailt! 
                  A QR kód szükséges lesz a belépéshez.
                </p>
              </div>

              <div class="footer">
                <p>Kérdésed van? Írj nekünk: info@re-generacio.hu</p>
                <p style="margin-top: 10px;">
                  <small>© ${new Date().getFullYear()} Re-Generáció. Minden jog fenntartva.</small>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send exception:", error);
    return { success: false, error };
  }
}
