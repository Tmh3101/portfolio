# Backend - Email configuration

This document explains how the backend is configured to send email using Resend.

Environment

- Add `RESEND_API_KEY` to `backend/.env` to enable Resend.

Test sending

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run the test script (uses Resend):

```bash
node scripts/send-test-email.mjs
```

Code

- `src/config/mailer.js` uses Resend. The exported `sendContactNotification(contact)` API remains unchanged.

Security

- Keep `RESEND_API_KEY` and SMTP credentials secret. Do not commit `.env` to
  version control.
