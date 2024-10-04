// app/api/checkUserRole/route.js
import User from '@models/User'; // Đảm bảo đúng đường dẫn tới model User
import { NextResponse } from 'next/server';
import connectMongo from 'utils/connectMongo'; // Đảm bảo đúng đường dẫn tới hàm kết nối MongoDB

export async function POST(request) {
  const { uid } = await request.json();

  if (!uid) {
    return NextResponse.json({ message: 'Missing uid' }, { status: 400 });
  }

  try {
    await connectMongo();

    // Tìm người dùng với uid
    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Trả về trạng thái quyền admin
    return NextResponse.json({ isAdmin: user.isAdmin }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
