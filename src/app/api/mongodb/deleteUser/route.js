import connectMongo from 'utils/connectMongo';
import User from '@models/User'; 

export async function POST(request) {
  try {
    // Kết nối với MongoDB
    await connectMongo();

    // Lấy dữ liệu từ request
    const { uid } = await request.json();

    // Kiểm tra nếu không có uid
    if (!uid) {
      return new Response(
        JSON.stringify({ message: 'Missing uid for MongoDB deletion' }),
        { status: 400 }
      );
    }

    // Tìm và xóa người dùng dựa trên uid
    const user = await User.findOneAndDelete({ uid });

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found in MongoDB' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully from MongoDB' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user from MongoDB:', error);
    return new Response(
      JSON.stringify({ message: 'Error deleting user from MongoDB' }),
      { status: 500 }
    );
  }
}
