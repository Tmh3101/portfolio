import {
  isMailerConfigured,
  sendContactNotification,
} from "../src/config/mailer.js";

async function run() {
  if (!isMailerConfigured) {
    console.error(
      "Mailer not configured. Set RESEND_API_KEY or SMTP env vars plus MAIL_FROM and CONTACT_TO_EMAIL.",
    );
    process.exit(1);
  }

  const contact = {
    name: "Test Sender",
    email: "test@example.com",
    message: "This is a test email from the portfolio backend.",
    ip: "127.0.0.1",
    country: "Local",
    region: "Local",
    city: "Localhost",
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await sendContactNotification(contact);
    console.log("send result:", res);
  } catch (err) {
    console.error("send failed:", err?.message || err);
    process.exit(2);
  }
}

run();
