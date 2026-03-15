import { isMailerConfigured } from '../../../lib/services/mailer.js';
import { json, errorResponse } from '../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const databaseOk = true;

    return json(
      {
        ok: databaseOk,
        services: {
          database: databaseOk ? 'up' : 'down',
          mailer: isMailerConfigured ? 'configured' : 'missing',
        },
      },
      { status: databaseOk ? 200 : 503 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
