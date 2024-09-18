'use client';

import { useState } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // Để điều khiển giữa đăng nhập và đăng ký
  const router = useRouter();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Lưu JWT vào localStorage
        localStorage.setItem('token', data.token);
        message.success('Login successful!');
        router.push('/'); // Điều hướng về trang chủ sau khi đăng nhập
      } else {
        message.error(data.message || 'Login failed');
      }
    } catch (error) {
      message.error('An error occurred while logging in');
    }
    setLoading(false);
  };  

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Registration successful!');
        setActiveTab('login'); // Sau khi đăng ký thành công, chuyển sang tab đăng nhập
      } else {
        message.error(data.message || 'Registration failed');
      }
    } catch (error) {
      message.error('An error occurred while registering');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Tab Đăng nhập */}
        <Tabs.TabPane tab="Login" key="login">
          <Form name="login" onFinish={handleLogin}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        {/* Tab Đăng ký */}
        <Tabs.TabPane tab="Register" key="register">
          <Form name="register" onFinish={handleRegister}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Register
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>

      <style jsx>{`
        .auth-page {
          max-width: 400px;
          margin: 0 auto;
          padding: 50px 20px;
        }
      `}</style>
    </div>
  );
}
