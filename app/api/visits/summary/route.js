import { getVisitSummary } from '../../../../lib/services/visit.service.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const summary = await getVisitSummary();
    return json(summary);
  } catch (error) {
    return errorResponse(error);
  }
}
