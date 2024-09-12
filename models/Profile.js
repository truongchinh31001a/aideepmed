import mongoose from 'mongoose';

// Định nghĩa schema cho hồ sơ
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  images: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      originalname: { type: String, required: true },
      thirdPartyInfo: {
        predictions: [[String]], // Lưu dữ liệu dự đoán từ bên thứ 3
      },
    },
  ],
});

// Export model Hồ sơ
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
