import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const GET = async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Token not provided' }, { status: 401 });
    }

    // Giải mã token để lấy thông tin người dùng
    const user = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
};
