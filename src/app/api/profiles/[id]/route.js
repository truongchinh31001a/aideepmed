import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Profile from '@models/Profile';

// Hàm kết nối MongoDB
const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return; // Kiểm tra xem có kết nối chưa
  return mongoose.connect('mongodb://localhost:27017/imageDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Xử lý yêu cầu GET để lấy hồ sơ dựa trên ID
export async function GET(req, { params }) {
  const { id } = params; // Lấy ID từ URL

  try {
    await connectMongo(); // Kết nối đến MongoDB

    const profile = await Profile.findById(id); // Tìm hồ sơ theo ID

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Error fetching profile' }, { status: 500 });
  }
}
