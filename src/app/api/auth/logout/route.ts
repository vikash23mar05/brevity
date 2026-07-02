import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // To log out, we just clear the auth_token cookie
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.delete('auth_token');
  return response;
}
