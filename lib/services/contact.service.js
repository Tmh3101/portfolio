import { sendContactNotification } from './mailer.js';
import { getSupabaseAdminClient } from '../supabase/db-client.js';
import { createHttpError } from '../utils/http-error.js';
import { isValidEmail, sanitizeText } from '../utils/sanitize.js';

export const submitContact = async ({ name, email, message, metadata }) => {
  const sanitizedName = sanitizeText(name, 160);
  const sanitizedEmail = sanitizeText(email, 320);
  const sanitizedMessage = sanitizeText(message, 4000);

  if (!sanitizedEmail || !isValidEmail(sanitizedEmail) || !sanitizedMessage) {
    throw createHttpError(400, 'Invalid contact payload.');
  }

  const supabase = getSupabaseAdminClient();

  const { data: savedContact, error } = await supabase
    .from('contacts')
    .insert({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      ip: metadata.ip,
      country: metadata.country,
      region: metadata.region,
      city: metadata.city,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('Failed to save contact:', error);
    throw createHttpError(500, 'Failed to save contact.');
  }

  let mailDelivered = false;

  try {
    const delivery = await sendContactNotification({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      ip: metadata.ip,
      country: metadata.country,
      region: metadata.region,
      city: metadata.city,
      createdAt: savedContact.created_at.toISOString(),
    });
    mailDelivered = delivery.delivered;
  } catch (error) {
    console.error('Failed to send contact email:', error);
  }

  return {
    ok: true,
    mailDelivered,
  };
};
