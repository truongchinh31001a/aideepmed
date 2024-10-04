import { auth } from 'lib/firebaseAdmin';
import Profile from '@models/Profile';
import Report from '@models/Report';
import User from '@models/User'; // Import model User

export async function POST(req) {
  try {
    const { profileId, imageId, comment } = await req.json();
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.split(' ')[1]; // Lấy token từ header

    if (!token) {
      return new Response(JSON.stringify({ message: 'No token found' }), { status: 401 });
    }

    // Xác thực token với Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Tìm người dùng trong MongoDB dựa trên uid từ Firebase
    const userInDb = await User.findOne({ uid: userId });

    if (!userInDb) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Tìm profile và image
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
    }

    const image = profile.images.id(imageId);
    if (!image) {
      return new Response(JSON.stringify({ message: 'Image not found' }), { status: 404 });
    }

    // Tạo báo cáo mới và lưu ObjectId của người dùng
    const report = new Report({
      profileId: profile._id,  // Gán profileId từ profile đã tìm được
      comment,
      user: userInDb._id, // Gán ObjectId của người dùng
      imageDetails: {
        filename: image.filename,  // Gán thông tin ảnh từ profile
        path: image.path,
        originalname: image.originalname,
      }
    });

    // Lưu báo cáo vào cơ sở dữ liệu
    await report.save();

    // Cập nhật trạng thái của hình ảnh và thêm báo cáo
    image.status = false;
    image.reports.push(report._id);

    // Lưu thay đổi vào profile
    await profile.save();

    return new Response(JSON.stringify({ message: 'Report submitted successfully' }), { status: 201 });
  } catch (error) {
    console.error('Error submitting report:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
