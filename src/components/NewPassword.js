import { Form, Input, Button, message } from 'antd';
import { auth, updatePassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import cần thiết
import { useState } from 'react';

const SetNewPasswordForm = ({ email }) => {
  const [loading, setLoading] = useState(false);

  const handleSetNewPassword = async (values) => {
    setLoading(true);
    try {
      // Đăng nhập bằng email và Google để có thể đặt lại mật khẩu
      const userCredential = await signInWithEmailAndPassword(auth, email, values.currentPassword);
      const user = userCredential.user;

      // Cập nhật mật khẩu mới
      await updatePassword(user, values.newPassword);
      message.success('Password updated successfully!');
    } catch (error) {
      message.error(`Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="set-new-password" onFinish={handleSetNewPassword} layout="vertical">
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[{ required: true, message: 'Please enter your current password!' }]}
      >
        <Input.Password style={{ width: '300px', height: '40px' }} />
      </Form.Item>
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: 'Please enter your new password!' }]}
      >
        <Input.Password style={{ width: '300px', height: '40px' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '300px', height: '40px' }}>
          Set New Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SetNewPasswordForm;
