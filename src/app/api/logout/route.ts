import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect('/');
  
  // Delete the cookie
  response.cookies.delete('access_token');
  
  return response;
}
