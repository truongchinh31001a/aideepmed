// app/api/updateUserRole/route.js
import User from '@models/User'; // Đảm bảo đúng đường dẫn tới model User
import { NextResponse } from 'next/server';
import connectMongo from 'utils/connectMongo'; // Đảm bảo đúng đường dẫn tới hàm kết nối MongoDB

export async function POST(request) {
  try {
    const { uid, isAdmin } = await request.json();

    // Kiểm tra dữ liệu đầu vào
    if (!uid || typeof isAdmin !== 'boolean') {
      console.error('Missing uid or invalid isAdmin flag', { uid, isAdmin });
      return NextResponse.json({ message: 'Missing uid or isAdmin flag' }, { status: 400 });
    }

    // Kết nối MongoDB
    await connectMongo();

    // Tìm người dùng với uid
    const user = await User.findOne({ uid });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      console.error(`User with uid ${uid} not found`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Log người dùng hiện tại trước khi cập nhật
    console.log(`User found: ${user.email}, current isAdmin: ${user.isAdmin}`);

    // Cập nhật quyền admin
    user.isAdmin = isAdmin;
    await user.save();

    // Log sau khi cập nhật thành công
    console.log(`User admin status updated: ${user.email}, isAdmin: ${isAdmin}`);

    return NextResponse.json({ message: `User admin status updated to ${isAdmin}`, user }, { status: 200 });
  } catch (error) {
    // Log lỗi cụ thể
    console.error('Error updating user role:', error);

    // Phản hồi với lỗi chi tiết hơn
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
