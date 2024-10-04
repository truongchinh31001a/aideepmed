'use client';

import { Form, Input, Button, Divider } from 'antd';
import { useState } from 'react';
import { Store } from 'react-notifications-component';
import { auth, createUserWithEmailAndPassword } from '../firebase.config';
import { useTranslation } from 'react-i18next';

const RegisterForm = ({ setActiveTab }) => {
  const { t } = useTranslation(); // Translation hook
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    hasUppercase: false,
    hasNumber: false,
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  };

  const handleRegister = async (values) => {
    setLoading(true);
    const { firstName, lastName, email, password } = values;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Store.addNotification({
          title: t('register.successMessage'),
          message: t('register.successMessage'),
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
            onScreen: true
          }
        });
        setActiveTab('login');
      } else {
        Store.addNotification({
          title: t('register.errorMessage'),
          message: data.message || t('register.errorMessage'),
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: {
            duration: 3000,
            onScreen: true
          }
        });
      }
    } catch (error) {
      Store.addNotification({
        title: t('register.errorMessage'),
        message: error.message || t('register.errorMessage'),
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 3000,
          onScreen: true
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h3 className="register-heading" style={{ marginTop: "50px" }}>{t('register.title')}</h3>
      <Form
        name="register"
        onFinish={handleRegister}
        layout="vertical"
        style={{ maxWidth: '400px' }}
        requiredMark={false}
      >
        <Divider className="divider-text">{t('register.dividerText')}</Divider>

        <Form.Item
          label={t('register.emailLabel')}
          name="email"
          rules={[{ required: true, message: t('register.emailLabel') }]}
        >
          <Input style={{ width: '300px', height: '40px' }} />
        </Form.Item>

        <Form.Item
          label={t('register.firstNameLabel')}
          name="firstName"
          rules={[{ required: true, message: t('register.firstNameLabel') }]}
        >
          <Input style={{ width: '300px', height: '40px' }} />
        </Form.Item>

        <Form.Item
          label={t('register.lastNameLabel')}
          name="lastName"
          rules={[{ required: true, message: t('register.lastNameLabel') }]}
        >
          <Input style={{ width: '300px', height: '40px' }} />
        </Form.Item>

        <Form.Item
          label={t('register.passwordLabel')}
          name="password"
          rules={[{ required: true, message: t('register.passwordLabel') }]}
        >
          <Input.Password
            style={{ width: '300px', height: '40px' }}
            onFocus={() => setShowPasswordRequirements(true)}
            onBlur={() => setShowPasswordRequirements(false)}
            onChange={(e) => validatePassword(e.target.value)}
          />
        </Form.Item>

        <div className={`password-conditions ${showPasswordRequirements ? 'fade-in' : 'fade-out'}`}>
          <p style={{ color: passwordValidations.length ? 'green' : 'red' }}>
            {passwordValidations.length ? '✓' : '✗'} {t('register.passwordConditions.length')}
          </p>
          <p style={{ color: passwordValidations.hasUppercase ? 'green' : 'red' }}>
            {passwordValidations.hasUppercase ? '✓' : '✗'} {t('register.passwordConditions.uppercase')}
          </p>
          <p style={{ color: passwordValidations.hasNumber ? 'green' : 'red' }}>
            {passwordValidations.hasNumber ? '✓' : '✗'} {t('register.passwordConditions.number')}
          </p>
        </div>

        <Form.Item
          label={t('register.confirmPasswordLabel')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('register.confirmPasswordLabel') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('register.confirmPasswordError')));
              },
            }),
          ]}
        >
          <Input.Password style={{ width: '300px', height: '40px' }} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '300px', height: '50px' }}
            loading={loading}
            disabled={loading || !passwordValidations.length || !passwordValidations.hasUppercase || !passwordValidations.hasNumber}
          >
            {loading ? t('register.loading') : t('register.signUpButton')}
          </Button>
        </Form.Item>
      </Form>

      <style jsx>{`
        .register-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f5f5f5;
          text-align: center;
        }

        .register-heading {
          font-size: 26px;
          font-weight: bold;
          margin-bottom: 20px;
          white-space: nowrap;
        }

        .divider-text {
          margin: 20px 0;
        }

        .password-conditions {
          text-align: left;
          margin-bottom: 20px;
          opacity: 0;
          transition: opacity 0.5s ease;
          max-height: 0;
          overflow: hidden;
        }

        .fade-in {
          opacity: 1;
          max-height: 100px;
        }

        .fade-out {
          opacity: 0;
          max-height: 0;
        }

        @media (min-width: 768px) {
          .register-heading {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;
