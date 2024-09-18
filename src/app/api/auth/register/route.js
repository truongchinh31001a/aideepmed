import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/User'; // Model User của bạn
import connectMongo from 'utils/connectMongo';

export async function POST(req) {
  await connectMongo();
  try {
    const { username, email, password } = await req.json();

    // Kiểm tra xem tất cả trường có được gửi hay không
    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Tạo token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'Registration successful', token }, { status: 201 });
  } catch (error) {
    console.error('Error in registration:', error); // Log lỗi ra console để kiểm tra
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
