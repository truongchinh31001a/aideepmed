// middleware/adminCheck.js
import { auth } from 'lib/firebaseAdmin';
import User from '@models/User';

export const verifyTokenAndCheckAdmin = async (req) => {
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return { status: 401, message: 'Unauthorized' };
  }

  try {
    // Xác thực token từ Firebase
    const decodedToken = await auth.verifyIdToken(token);

    // Tìm người dùng trong MongoDB
    const currentUser = await User.findOne({ uid: decodedToken.uid });

    if (!currentUser || !currentUser.isAdmin) {
      return { status: 403, message: 'You do not have admin permissions' };
    }

    return { status: 200, currentUser };

  } catch (error) {
    return { status: 401, message: 'Unauthorized' };
  }
};
