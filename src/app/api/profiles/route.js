import { NextResponse } from 'next/server';
import connectMongo from '../../../../utils/connectMongo'; // Hàm kết nối tới MongoDB
import Profile from '../../../../models/Profile'; // Model Profile

export async function GET() {
  try {
    await connectMongo(); // Kết nối đến MongoDB

    const profileData = await Profile.find(); // Lấy dữ liệu từ collection `profiles`

    return NextResponse.json({ profileData });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch data', error }, { status: 500 });
  }
}
