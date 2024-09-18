import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });

  // Xóa cookie chứa session
  response.cookies.delete('session_user', { path: '/' });

  return response;
}
