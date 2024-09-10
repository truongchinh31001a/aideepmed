import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Profile from '../../../../models/Profile'; // Import model Profile
import { sendImageToThirdPartyAPI } from '../../../../services/sendImageToThirdPartyAPI'; // Import dịch vụ gửi ảnh tới API bên thứ ba
import path from 'path';
import { promises as fs } from 'fs'; // Dùng promises để làm việc với file system

// Kết nối MongoDB
const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect('mongodb://localhost:27017/imageDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function POST(req) {
  await connectMongo(); // Kết nối đến MongoDB

  const formData = await req.formData(); // Lấy dữ liệu từ request
  const name = formData.get('name'); // Tên của hồ sơ
  const files = formData.getAll('images'); // Lấy tất cả file ảnh từ form

  if (!name || files.length === 0) {
    return NextResponse.json({ message: 'Profile name and images are required' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads'); // Đường dẫn đến thư mục uploads
  await fs.mkdir(uploadDir, { recursive: true }); // Đảm bảo thư mục upload tồn tại

  // Lưu từng ảnh vào server và tạo danh sách images
  const images = await Promise.all(files.map(async (file) => {
    const filePath = `/uploads/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await fs.writeFile(`./public${filePath}`, buffer); // Lưu file

    return {
      filename: file.name,
      path: filePath,
      originalname: file.name,
    };
  }));

  // Tạo hồ sơ mới và lưu vào MongoDB
  let profile = new Profile({
    name,
    images,
  });
  await profile.save();

  // Gửi từng ảnh tới API bên thứ ba và nhận kết quả
  const updatedImages = await Promise.all(images.map(async (image) => {
    try {
      const thirdPartyResult = await sendImageToThirdPartyAPI(`./public${image.path}`);
      return {
        ...image,
        thirdPartyInfo: thirdPartyResult, // Lưu kết quả từ API bên thứ ba vào ảnh
      };
    } catch (error) {
      console.error(`Failed to process image ${image.filename}: ${error.message}`);
      return image; // Nếu lỗi, trả về ảnh gốc
    }
  }));

  // Cập nhật hồ sơ với thông tin mới từ API bên thứ ba
  profile.images = updatedImages;
  await profile.save(); // Lưu lại hồ sơ đã cập nhật

  return NextResponse.json({
    message: 'Profile created and updated with third-party info successfully',
    profile,
  });
}

export const config = {
  api: {
    bodyParser: false, // Tắt bodyParser vì sử dụng form-data
  },
};
