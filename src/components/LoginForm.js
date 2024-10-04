'use client';

import { Form, Input, Button, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from './GoogleLoginButton';
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import { verifyToken } from './verifyToken';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useState } from 'react';

const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation(); // Initialize the translation hook
  const [loading, setLoading] = useState(false); // Loading state for both email and Google

  // Xử lý đăng nhập bằng email/password
  const handleLogin = async (values) => {
    setLoading(true);

    const { email, password } = values;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Store.addNotification({
          title: 'Success!',
          message: t('login.loginSuccess'), // Translated success message
          type: 'success',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });

        router.push('/');
      } else {
        Store.addNotification({
          title: 'Error!',
          message: data.message || t('login.loginError'), // Translated error message
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          animationIn: ['animate__animated', 'animate__fadeIn'],
          animationOut: ['animate__animated', 'animate__fadeOut'],
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      }
      await verifyToken();
    } catch (e) {
      Store.addNotification({
        title: 'Error!',
        message: t('login.loginErrorOccurred'), // Translated error message
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h3 className="login-heading">{t('login.title')}</h3>

        {/* Google login button */}
        <GoogleLoginButton setLoading={setLoading} /> 

        <Divider className="divider-text">{t('login.orWithEmail')}</Divider>

        {/* Email/Password login form */}
        <Form name="login" onFinish={handleLogin} layout="vertical" requiredMark={false}>
          <Form.Item
            label={t('login.email')} // Translated label for email
            name="email"
            rules={[{ required: true, message: t('login.email') }]} // Translated validation message
          >
            <Input style={{ width: '300px', height: '40px' }} />
          </Form.Item>

          <Form.Item
            label={t('login.password')} // Translated label for password
            name="password"
            rules={[{ required: true, message: t('login.password') }]} // Translated validation message
          >
            <Input.Password style={{ width: '300px', height: '40px' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              style={{ width: '300px', height: '50px' }}
              loading={loading} // Hiển thị loading khi đăng nhập
            >
              {t('login.loginButton')} {/* Translated login button */}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70vh;
          background-color: #f5f5f5;
        }

        .login-box {
          padding: 40px;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          margin: auto;
        }

        .login-heading {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .divider-text {
          margin: 20px 0;
        }

        .login-button {
          width: 300px;
          height: 50px;
        }

        .ant-form-item {
          margin-bottom: 20px;
        }

        @media (min-width: 768px) {
          .login-box {
            padding: 60px;
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
