import { openApiDocument } from '../../../lib/docs/openapi.js';
import { json } from '../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET() {
  return json(openApiDocument);
}
