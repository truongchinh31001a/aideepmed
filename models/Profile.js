import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên của hồ sơ
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo hồ sơ
  images: [{
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    thirdPartyInfo: { type: Object }, // Thông tin từ API bên thứ ba (nếu có)
  }],
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
