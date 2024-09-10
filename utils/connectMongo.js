import mongoose from 'mongoose';

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return; // Nếu đã kết nối, bỏ qua
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectMongo;
