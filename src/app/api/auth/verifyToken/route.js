// /app/api/auth/verifyToken/route.js
import { NextResponse } from 'next/server';
import { adminAuth } from 'lib/firebaseAdmin'; // Đảm bảo đường dẫn tới file khởi tạo Firebase Admin SDK là chính xác

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Xác thực token với Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ message: 'Token is valid', uid: decodedToken.uid }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token', error: error.message }, { status: 401 });
  }
}
