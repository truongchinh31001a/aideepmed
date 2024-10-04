// app/api/getUserDetails/route.js
import { NextResponse } from 'next/server';
import connectMongo from 'utils/connectMongo'; // Import hàm kết nối MongoDB
import User from 'models/User'; // Import mô hình User từ thư mục models

export async function POST(request) {
  try {
    const body = await request.json(); // Lấy toàn bộ body của request
    console.log("Request body:", body); // Ghi log body để kiểm tra nội dung
    const { uid } = body; // Lấy `uid` từ body
    console.log("Received UID:", uid); // Ghi log để kiểm tra UID

    if (!uid) {
      return NextResponse.json({ message: 'Missing uid' }, { status: 400 });
    }

    await connectMongo(); // Kết nối tới database MongoDB

    const user = await User.findOne({ uid }); // Tìm người dùng bằng `uid`

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 }); // Trả về thông tin người dùng
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
