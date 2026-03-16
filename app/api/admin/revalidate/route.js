import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase/server';

/**
 * On-demand revalidation endpoint for administrative updates.
 * Purges the Next.js Data Cache for specific paths.
 */
export async function POST(request) {
  try {
    // 1. Security Check: Only authenticated users can trigger revalidation
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const path = body.path || '/';

    // 3. Revalidate
    revalidatePath(path);

    console.log(`[Revalidation] Cache purged for path: ${path}`);

    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
