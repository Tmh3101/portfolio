import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../../lib/config/env.js';
import { requireRole, requireUser } from '../../../../lib/auth/server.js';
import { json, errorResponse } from '../../../../lib/http/response.js';
import { createHttpError } from '../../../../lib/utils/http-error.js';

export const runtime = 'nodejs';

/**
 * AI Translation API Route
 * POST /api/admin/translate
 * Body: { text: string }
 */
export async function POST(request) {
  try {
    // 1. Security Check
    const user = await requireUser(request);
    requireRole(user, 'admin');

    // 2. Parse Request Body
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return json({ translatedText: '' });
    }

    // 3. Initialize AI Client
    const apiKey = env.googleGeminiApiKey;
    if (!apiKey) {
      throw createHttpError(500, 'AI Service configuration missing (API Key).');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: env.googleGeminiModel });

    // 4. Prompt Engineering
    const systemPrompt = `You are an expert IT technical translator. 
Translate the following Vietnamese text to professional English. 
Crucially preserve all markdown formatting, HTML tags, line breaks, and emojis.
Do not translate brand names, programming languages, or IT jargon (e.g., Next.js, React, Refactor, Deploy, Backend, Frontend, Fullstack, Git, Supabase, Vercel).
Output ONLY the translated text, without any conversational filler, introductory phrases, or wrapping in markdown code blocks like \` \` \`markdown.
Return raw translated text.`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: `Text to translate: ${text}` },
    ]);

    const response = await result.response;
    const translatedText = response.text().trim();

    // 5. Return Response
    return json({ translatedText });
  } catch (error) {
    // If it's a JSON parsing error
    if (error instanceof SyntaxError) {
      return errorResponse(createHttpError(400, 'Invalid JSON body.'));
    }
    return errorResponse(error);
  }
}
