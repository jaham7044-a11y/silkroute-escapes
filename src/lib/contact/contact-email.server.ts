import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import { getEmailConfig } from "../config.server";
import { getEmailConfigDiagnostics, logContactError, logContactInfo } from "./contact-log.server";

export type ContactEnquiry = {
  debugId?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  dates?: string;
  travelers?: number;
  destinations?: string;
  budget?: string;
  message?: string;
};

function getTransporter(): Transporter {
  const { user, appPassword } = getEmailConfig();
  const diagnostics = getEmailConfigDiagnostics();

  void logContactInfo("Creating SMTP transporter", diagnostics);

  if (!user || !appPassword) {
    void logContactError("Email configuration missing", new Error("Email is not configured"), diagnostics);
    throw new Error("Email is not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass: appPassword,
    },
  });
}

function buildSubject(enquiry: ContactEnquiry): string {
  const destination = enquiry.destinations?.trim() || "Custom Itinerary";
  return `New Travel Enquiry — ${enquiry.name} — ${destination}`;
}

function buildPlainText(enquiry: ContactEnquiry): string {
  const lines = [
    "New website travel enquiry",
    "",
    "CUSTOMER DETAILS",
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone?.trim() || "Not provided"}`,
    `Country: ${enquiry.country?.trim() || "Not provided"}`,
    "",
    "TRIP DETAILS",
    "",
    `Destination: ${enquiry.destinations?.trim() || "Not specified"}`,
    `Travel Dates: ${enquiry.dates?.trim() || "Not provided"}`,
    `Travellers: ${enquiry.travelers ?? "Not provided"}`,
    `Budget: ${enquiry.budget?.trim() || "Not provided"}`,
    "",
    "MESSAGE",
    "",
    enquiry.message?.trim() || "No message provided.",
  ];

  return lines.join("\n");
}

function buildHtml(enquiry: ContactEnquiry): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#8a7a5a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#1a2332;font-size:15px;line-height:1.5;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding-bottom:12px;border-bottom:1px solid #d4c4a0;">
          <p style="margin:0;color:#8a7a5a;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">${title}</p>
        </td>
      </tr>
      <tr><td style="padding-top:16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
    </table>`;

  const customerRows = [
    row("Name", escapeHtml(enquiry.name)),
    row("Email", `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#1a2332;text-decoration:none;">${escapeHtml(enquiry.email)}</a>`),
    row("Phone", escapeHtml(enquiry.phone?.trim() || "Not provided")),
    row("Country", escapeHtml(enquiry.country?.trim() || "Not provided")),
  ].join("");

  const tripRows = [
    row("Destination", escapeHtml(enquiry.destinations?.trim() || "Not specified")),
    row("Travel Dates", escapeHtml(enquiry.dates?.trim() || "Not provided")),
    row("Travellers", escapeHtml(enquiry.travelers != null ? String(enquiry.travelers) : "Not provided")),
    row("Budget", escapeHtml(enquiry.budget?.trim() || "Not provided")),
  ].join("");

  const message = escapeHtml(enquiry.message?.trim() || "No message provided.").replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f0e8;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #d4c4a0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#1a2332 0%,#2d3a4f 100%);padding:32px 40px;">
              <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">Luxury China Travels</p>
              <h1 style="margin:0;color:#f5f0e6;font-size:28px;font-weight:400;line-height:1.3;">New Travel Enquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${section("Customer Details", customerRows)}
              ${section("Trip Details", tripRows)}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:12px;border-bottom:1px solid #d4c4a0;">
                    <p style="margin:0;color:#8a7a5a;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">Message</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;color:#1a2332;font-size:15px;line-height:1.7;">${message}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;background:#faf8f4;border-top:1px solid #d4c4a0;">
              <p style="margin:0;color:#8a7a5a;font-size:12px;">Reply directly to this email to respond to the customer.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEnquiryEmail(enquiry: ContactEnquiry): Promise<void> {
  const { user } = getEmailConfig();

  await logContactInfo("Sending contact enquiry email", {
    debugId: enquiry.debugId,
    customerEmail: enquiry.email,
    customerName: enquiry.name,
    destinations: enquiry.destinations ?? null,
    emailConfig: getEmailConfigDiagnostics(),
  });

  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"Luxury China Travels Website" <${user}>`,
      to: user,
      replyTo: enquiry.email,
      subject: buildSubject(enquiry),
      text: buildPlainText(enquiry),
      html: buildHtml(enquiry),
    });

    await logContactInfo("Contact enquiry email sent", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
  } catch (error) {
    await logContactError("Nodemailer sendMail failed", error, {
      debugId: enquiry.debugId,
      customerEmail: enquiry.email,
      customerName: enquiry.name,
      smtpHost: "smtp.gmail.com",
      smtpPort: 465,
    });
    throw error;
  }
}
