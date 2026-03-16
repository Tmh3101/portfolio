import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../../../lib/config/env.js';
// Import createClient from the new Supabase server utility
import { createClient } from '../../../../lib/supabase/server';
import { json, errorResponse } from '../../../../lib/http/response.js';
import { createHttpError } from '../../../../lib/utils/http-error.js';

/**
 * AI Translation API Route
 * POST /api/admin/translate
 * Body: { text: string }
 */
export async function POST(request) {
  try {
    // 1. Security Check using Supabase Auth
    const supabase = await createClient(); // Initialize Supabase client
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // If unauthorized, return a 401 response
      return errorResponse(new Error('Unauthorized'), 401);
    }

    // Ensure the user is an admin (this part might need adjustment if roles are managed differently)
    // For now, we assume any authenticated user can access this translation service,
    // or an admin role check would be added here if necessary.
    // Example: if (user.role !== 'admin') return errorResponse(new Error('Forbidden'), 403);

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
Output ONLY the translated text, without any conversational filler, introductory phrases, or wrapping in markdown code blocks like.
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
