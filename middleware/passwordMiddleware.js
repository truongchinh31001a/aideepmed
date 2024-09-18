import bcrypt from 'bcrypt';

// Middleware để mã hóa mật khẩu trước khi lưu
export const hashPassword = async function (next) {
  const user = this;

  // Kiểm tra xem mật khẩu có bị thay đổi không, nếu không thì bỏ qua mã hóa
  if (!user.isModified('password')) return next();

  try {
    // Tạo một salt để mã hóa
    const salt = await bcrypt.genSalt(10);
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // Gán mật khẩu đã mã hóa
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
};

// Hàm so sánh mật khẩu khi đăng nhập
export const comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
