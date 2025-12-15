import { NextResponse } from 'next/server';

/**
 * Auth check endpoint for console gating
 * In production, this would check actual authentication state
 */
export async function GET() {
  // For now, always return unauthorized
  // In production, check session/cookies/JWT
  return NextResponse.json(
    { authenticated: false },
    { status: 401 }
  );
}
