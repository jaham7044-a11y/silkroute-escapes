import { execFile } from "node:child_process";

import { getEmailConfig } from "../config.server";
import type { ContactEnquiry } from "./contact-email.server";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function buildSubject(enquiry: ContactEnquiry): string {
  const destination = enquiry.destinations?.trim() || "Custom Itinerary";
  return `New Travel Enquiry - ${enquiry.name} - ${destination}`;
}

function buildPlainText(enquiry: ContactEnquiry): string {
  return [
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
  ].join("\n");
}

function buildHtml(enquiry: ContactEnquiry): string {
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

function buildMimeMessage(enquiry: ContactEnquiry) {
  const { user } = getEmailConfig();
  if (!user) throw new Error("Email is not configured. Set EMAIL_USER.");

  const boundary = `luxury-china-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const safeUser = sanitizeHeader(user);
  const safeCustomerEmail = sanitizeHeader(enquiry.email);
  const safeSubject = sanitizeHeader(buildSubject(enquiry));

  return [
    `From: "Luxury China Travels Website" <${safeUser}>`,
    `To: ${safeUser}`,
    `Reply-To: ${safeCustomerEmail}`,
    `Subject: ${safeSubject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    buildPlainText(enquiry),
    "",
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    buildHtml(enquiry),
    "",
    `--${boundary}--`,
    "",
  ].join("\n");
}

function execSendmail(command: string, args: string[], message: string) {
  return new Promise<void>((resolve, reject) => {
    const child = execFile(command, args, { timeout: 20_000 }, (error, stdout, stderr) => {
      if (error) {
        reject(
          Object.assign(error, {
            stdout,
            stderr,
            sendmailCommand: command,
          }),
        );
        return;
      }

      resolve();
    });

    child.stdin?.end(message);
  });
}

export async function sendContactEnquiryWithSendmail(enquiry: ContactEnquiry) {
  const { user } = getEmailConfig();
  if (!user) throw new Error("Email is not configured. Set EMAIL_USER.");

  const message = buildMimeMessage(enquiry);
  const args = ["-i", "-f", user, user];
  const candidates = ["/usr/sbin/sendmail", "/usr/lib/sendmail", "sendmail"];
  const failures: unknown[] = [];

  for (const command of candidates) {
    try {
      await execSendmail(command, args, message);
      return;
    } catch (error) {
      failures.push(error);
    }
  }

  throw new Error(`Unable to send with local sendmail. Tried: ${candidates.join(", ")}. Last error: ${String(failures.at(-1))}`);
}
