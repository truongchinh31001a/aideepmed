import { auth } from "lib/firebaseAdmin"; // Đảm bảo bạn đã cấu hình Firebase Admin SDK đúng cách

export async function GET(request) {
  try {
    // Lấy danh sách người dùng từ Firebase Auth
    const listUsers = await auth.listUsers();
    
    // Định dạng lại danh sách người dùng để trả về các thông tin cần thiết
    const formattedUsers = listUsers.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || 'N/A',
      createdAt: userRecord.metadata.creationTime, // Ngày tạo tài khoản
      lastSignInTime: userRecord.metadata.lastSignInTime, // Lần đăng nhập gần nhất
      photoURL: userRecord.photoURL || null, // Ảnh đại diện (nếu có)
    }));

    return new Response(JSON.stringify(formattedUsers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error fetching users', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
