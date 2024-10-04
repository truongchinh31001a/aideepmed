// src/app/api/user/currentUser/route.js
import { auth } from 'lib/firebaseAdmin';
import User from '@models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Lấy token từ headers
    const token = req.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Xác thực token
    const decodedToken = await auth.verifyIdToken(token);
    const { uid } = decodedToken;

    // Tìm người dùng trong MongoDB
    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Trả về thông tin người dùng
    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      isAdmin: user.isAdmin,
      firstName: user.firstName,
      lastName: user.lastName,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
