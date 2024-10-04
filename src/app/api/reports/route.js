// app/api/reports/route.js
import { NextResponse } from 'next/server';
import connectMongo from 'utils/connectMongo';
import Report from 'models/Report'; // Import model Report

export async function GET() {
  try {
    await connectMongo(); // Kết nối tới MongoDB

    // Lấy tất cả các báo cáo và populate thông tin từ bảng User
    const reports = await Report.find().populate('user', 'firstName lastName'); // Chỉ lấy firstName và lastName từ User

    return NextResponse.json(reports, { status: 200 }); // Trả về dữ liệu báo cáo với thông tin người dùng
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
