import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '../../../../lib/config/env.js';
import { createClient } from '../../../../lib/supabase/server';
import { json, errorResponse } from '../../../../lib/http/response.js';
import { createHttpError } from '../../../../lib/utils/http-error.js';

/**
 * AI Translation API Route (Vercel AI SDK Refactor)
 * POST /api/admin/translate
 * Body: { text: string }
 */
export async function POST(request) {
  try {
    // 1. Security Check using Supabase Auth
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(new Error('Unauthorized'), 401);
    }

    // 2. Parse Request Body
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return json({ translatedText: '' });
    }

    // 3. Initialize AI Client (Vercel AI SDK)
    const apiKey = env.googleGeminiApiKey;
    if (!apiKey) {
      throw createHttpError(500, 'AI Service configuration missing (API Key).');
    }

    // Configure the Google provider with the API key
    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });
    const model = google(env.googleGeminiModel || 'gemini-1.5-flash');

    // 4. Prompt Engineering & Execution
    const { text: translatedText } = await generateText({
      model: model,
      system: `You are an expert IT technical translator. 
Translate the following Vietnamese text to professional English. 
Crucially preserve all markdown formatting, HTML tags, line breaks, and emojis.
Do not translate brand names, programming languages, or IT jargon (e.g., Next.js, React, Refactor, Deploy, Backend, Frontend, Fullstack, Git, Supabase, Vercel).
Output ONLY the translated text, without any conversational filler, introductory phrases, or wrapping in markdown code blocks.
Return raw translated text.`,
      prompt: `Text to translate: ${text}`,
    });

    // 5. Return Response
    return json({ translatedText: translatedText.trim() });
  } catch (error) {
    console.error('AI Translation error:', error);
    // If it's a JSON parsing error
    if (error instanceof SyntaxError) {
      return errorResponse(createHttpError(400, 'Invalid JSON body.'));
    }
    return errorResponse(error);
  }
}
