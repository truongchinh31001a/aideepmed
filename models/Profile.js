import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  images: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      originalname: { type: String, required: true },
      thirdPartyInfo: {
        predictions: [[String]],
      },
      status: { type: Boolean, default: true },
      reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }], // Tham chiếu đến Report
    },
  ],
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
