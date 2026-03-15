import { submitContact } from '../../../lib/services/contact.service.js';
import { buildRequestMetadata, getClientIp } from '../../../lib/utils/request-metadata.js';
import { checkRateLimit } from '../../../lib/http/rate-limit.js';
import { json, errorResponse } from '../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const ip = getClientIp(request) || 'unknown';
    const rate = checkRateLimit({
      key: `contact:${ip}`,
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rate.ok) {
      return json(
        { message: 'Too many contact requests. Please try again later.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const result = await submitContact({
      ...body,
      metadata: buildRequestMetadata(request),
    });

    return json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
