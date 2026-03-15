import { Resend } from "resend";
import { env } from "./env.js";

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// Resend client (optional)
const resendClient = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export const isMailerConfigured = Boolean(
  resendClient && env.mailFrom && env.contactToEmail,
);

export const sendContactNotification = async (contact) => {
  if (!isMailerConfigured) return { delivered: false };

  const { name, email, message, ip, country, region, city, createdAt } =
    contact;
  const safeName = escapeHtml(name || "Anonymous visitor");
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const safeIp = escapeHtml(ip || "unknown");
  const safeLocation = escapeHtml(
    [city, region, country].filter(Boolean).join(", ") || "unknown",
  );
  const safeCreatedAt = escapeHtml(createdAt);

  const subject = `[Portfolio Contact] ${name || "Anonymous"} <${email}>`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #12202a; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New portfolio contact</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>IP:</strong> ${safeIp}</p>
      <p><strong>Location:</strong> ${safeLocation}</p>
      <p><strong>Created at:</strong> ${safeCreatedAt}</p>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #d7e2e7;" />
      <p style="white-space: normal;">${safeMessage}</p>
    </div>
  `;

  // Use Resend only
  if (!resendClient) return { delivered: false };

  try {
    await resendClient.emails.send({
      from: env.mailFrom,
      to: env.contactToEmail,
      subject,
      html,
      reply_to: email || undefined,
    });

    return { delivered: true, provider: "resend" };
  } catch (err) {
    console.error("Resend send failed:", err?.message || err);
    return { delivered: false };
  }
};
