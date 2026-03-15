import { recordVisit } from '../../../lib/services/visit.service.js';
import { buildRequestMetadata, getClientIp } from '../../../lib/utils/request-metadata.js';
import { checkRateLimit } from '../../../lib/http/rate-limit.js';
import { json, errorResponse } from '../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const ip = getClientIp(request) || 'unknown';
    const rate = checkRateLimit({
      key: `visit:${ip}`,
      limit: 30,
      windowMs: 60 * 1000,
    });

    if (!rate.ok) {
      return json({ message: 'Too many requests.' }, { status: 429 });
    }

    const body = await request.json();
    const result = await recordVisit({
      path: body?.path,
      metadata: buildRequestMetadata(request),
    });

    return json(result, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
