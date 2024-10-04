import { NextResponse } from 'next/server';
import User from '@models/User';
import connectMongo from 'utils/connectMongo';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { auth } from '@/firebase.config'; // Firebase config của bạn

export async function checkUserAndLink(req, res, next) {
  try {
    const { email, password } = await req.json();

    // Kết nối với MongoDB
    await connectMongo();

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      // Nếu người dùng chưa tồn tại trong MongoDB
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Người dùng đã tồn tại trong cơ sở dữ liệu
    const firebaseUser = auth.currentUser;
    
    // Kiểm tra nếu người dùng đã đăng nhập bằng Google
    if (firebaseUser && firebaseUser.providerData.some(provider => provider.providerId === 'google.com')) {
      const credential = EmailAuthProvider.credential(email, password);

      try {
        // Liên kết tài khoản email/password với tài khoản Google
        await linkWithCredential(firebaseUser, credential);
        return NextResponse.json({ message: "Account linked successfully" }, { status: 200 });
      } catch (error) {
        console.error("Error linking accounts:", error);
        return NextResponse.json({ message: "Linking accounts failed" }, { status: 500 });
      }
    }

    // Nếu không phải tài khoản Google, không cần liên kết
    return next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.json({ message: "Middleware error: " + error.message }, { status: 500 });
  }
}
