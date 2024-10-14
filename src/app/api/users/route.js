import { NextResponse } from 'next/server';
import connectMongo from 'utils/connectMongo';
import User from 'models/User';
import { auth } from 'lib/firebaseAdmin';

export async function GET() {
  try {
    // Kết nối MongoDB
    await connectMongo();

    // Lấy dữ liệu người dùng từ MongoDB
    const mongoUsers = await User.find({}).lean();

    // Lấy dữ liệu từ Firebase
    const firebaseUsers = await auth.listUsers();

    // Chuyển đổi dữ liệu Firebase
    const firebaseUserData = firebaseUsers.users.map((userRecord) => ({
      id: userRecord.uid,
      displayName: userRecord.displayName || 'N/A',
      email: userRecord.email,
      createdAt: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
      photoURL: userRecord.photoURL || '',
      source: 'Firebase'
    }));

    // Chuyển đổi dữ liệu MongoDB
    const mongoUserData = mongoUsers.map((user) => ({
      id: user.uid,
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      createdAt: user.createdAt,
      lastSignInTime: user.updatedAt,
      photoURL: user.image || '',
      isAdmin: user.isAdmin,
      source: 'MongoDB'
    }));

    // Tạo Map để lưu người dùng theo email
    const userMap = new Map();

    // Thêm dữ liệu từ MongoDB vào Map
    mongoUserData.forEach(user => {
      userMap.set(user.email, user);
    });

    // Thêm dữ liệu từ Firebase vào Map (chỉ thêm nếu email chưa tồn tại)
    firebaseUserData.forEach(user => {
      if (!userMap.has(user.email)) {
        userMap.set(user.email, user);
      }
    });

    // Chuyển Map thành array để trả về kết quả
    const mergedUsers = Array.from(userMap.values());

    // Trả về kết quả đã gộp (không trùng email)
    return NextResponse.json(mergedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse('Error fetching users', { status: 500 });
  }
}
