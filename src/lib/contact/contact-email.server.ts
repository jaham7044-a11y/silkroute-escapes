import { createRequire } from "node:module";

import type { Transporter } from "nodemailer";

import { getEmailConfig } from "../config.server";

const require = createRequire(import.meta.url);

export type ContactEnquiryEmailInput = {
  enquiryId?: string;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildSubject(enquiry: ContactEnquiryEmailInput): string {
  const destination = enquiry.destinations?.trim() || "Custom Itinerary";
  return `New Travel Enquiry - ${enquiry.name} - ${destination}`;
}

function buildPlainText(enquiry: ContactEnquiryEmailInput): string {
  return [
    "New website travel enquiry",
    enquiry.enquiryId ? `Firestore ID: ${enquiry.enquiryId}` : "",
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
  ].filter(Boolean).join("\n");
}

function buildHtml(enquiry: ContactEnquiryEmailInput): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#8a7a5a;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#1a2332;font-size:15px;line-height:1.5;">${value}</td>
    </tr>`;

  const message = escapeHtml(enquiry.message?.trim() || "No message provided.").replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f0e8;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #d4c4a0;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#1a2332;padding:32px 40px;">
              <p style="margin:0 0 8px;color:#c9a84c;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;">Luxury China Travels</p>
              <h1 style="margin:0;color:#f5f0e6;font-size:28px;font-weight:400;line-height:1.3;">New Travel Enquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${enquiry.enquiryId ? row("Firestore ID", escapeHtml(enquiry.enquiryId)) : ""}
                ${row("Name", escapeHtml(enquiry.name))}
                ${row("Email", `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#1a2332;text-decoration:none;">${escapeHtml(enquiry.email)}</a>`)}
                ${row("Phone", escapeHtml(enquiry.phone?.trim() || "Not provided"))}
                ${row("Country", escapeHtml(enquiry.country?.trim() || "Not provided"))}
                ${row("Destination", escapeHtml(enquiry.destinations?.trim() || "Not specified"))}
                ${row("Travel Dates", escapeHtml(enquiry.dates?.trim() || "Not provided"))}
                ${row("Travellers", escapeHtml(enquiry.travelers != null ? String(enquiry.travelers) : "Not provided"))}
                ${row("Budget", escapeHtml(enquiry.budget?.trim() || "Not provided"))}
              </table>
              <h2 style="margin:28px 0 12px;color:#8a7a5a;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;">Message</h2>
              <div style="color:#1a2332;font-size:15px;line-height:1.7;">${message}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function getTransporter(): Transporter {
  const { user, appPassword } = getEmailConfig();

  if (!user || !appPassword) {
    throw new Error("Email is not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD.");
  }

  const nodemailer = require("nodemailer") as typeof import("nodemailer");

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

export async function sendContactEnquiryEmail(enquiry: ContactEnquiryEmailInput): Promise<void> {
  const { user } = getEmailConfig();
  if (!user) throw new Error("Email is not configured. Set EMAIL_USER.");

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Luxury China Travels Website" <${user}>`,
    to: user,
    replyTo: enquiry.email,
    subject: buildSubject(enquiry),
    text: buildPlainText(enquiry),
    html: buildHtml(enquiry),
  });
}
