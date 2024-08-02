import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect('http://localhost:3000');
  
  // Delete the cookie
  response.cookies.delete('access_token');
  
  return response;
}
