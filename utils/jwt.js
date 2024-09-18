import jwt from 'jsonwebtoken';

export const getTokenFromHeaders = (req) => {
  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    throw new Error('No token provided');
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    throw new Error('Invalid token format');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    console.error("Token verification error:", error);
    throw new Error('Invalid token');
  }
};
