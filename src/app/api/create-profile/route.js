import { NextResponse } from 'next/server';
import Profile from '../../../../models/Profile'; 
import { sendImageToThirdPartyAPI } from '../../../../services/sendImageToThirdPartyAPI';
import path from 'path';
import { promises as fs } from 'fs'; 
import connectMongo from '../../../../utils/connectMongo';
import { auth } from 'lib/firebaseAdmin'; // Import Firebase Admin để xác thực

export async function POST(req) {
  await connectMongo(); // Kết nối MongoDB

  const formData = await req.formData(); // Nhận dữ liệu form
  const name = formData.get('name'); // Lấy tên từ form data
  const files = formData.getAll('images'); // Lấy danh sách file ảnh

  if (!name || files.length === 0) {
    return NextResponse.json({ message: 'Profile name and images are required' }, { status: 400 });
  }

  // Tạo thư mục upload nếu chưa tồn tại
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const images = await Promise.all(files.map(async (file) => {
    const filePath = `/uploads/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(`./public${filePath}`, buffer); // Lưu file lên server

    return {
      filename: file.name,
      path: filePath,
      originalname: file.name,
    };
  }));

  let isUser = false; // Khởi tạo giá trị mặc định của isUser là false

  // Kiểm tra header Authorization để xác định người dùng đã đăng nhập chưa
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Lấy token từ header
    try {
      const decodedToken = await auth.verifyIdToken(token); // Xác thực token
      if (decodedToken) {
        isUser = true; // Nếu người dùng đã đăng nhập, đặt isUser = true
      }
    } catch (error) {
      console.error('Failed to verify token:', error.message);
    }
  }

  // Tạo đối tượng Profile mới
  let profile = new Profile({
    name,
    images,
    isUser, // Gán giá trị isUser vào Profile
  });
  await profile.save(); // Lưu hồ sơ vào MongoDB

  const updatedImages = await Promise.all(images.map(async (image) => {
    try {
      const thirdPartyResult = await sendImageToThirdPartyAPI(`./public${image.path}`);
      return {
        ...image,
        thirdPartyInfo: thirdPartyResult,
      };
    } catch (error) {
      console.error(`Failed to process image ${image.filename}: ${error.message}`);
      return image;
    }
  }));

  profile.images = updatedImages;
  await profile.save(); // Cập nhật lại Profile với thông tin từ bên thứ 3

  return NextResponse.json({
    message: 'Profile created and updated with third-party info successfully',
    profile,
  });
}

export const config = {
  api: {
    bodyParser: false, // Vô hiệu hóa bodyParser để sử dụng formData
  },
};
