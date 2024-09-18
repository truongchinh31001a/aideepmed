// /api/protected.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy JWT từ header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Xác thực JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Access granted', user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
