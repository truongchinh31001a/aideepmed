'use client';

import { useState } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // Import icon ArrowLeftOutlined
import { useRouter } from 'next/navigation'; // Import useRouter hook for navigation
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function AuthPage() {
  const { t } = useTranslation(); // Initialize translation hook
  const [loading, setLoading] = useState(false);
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'reset'
  const [formClass, setFormClass] = useState('fade-in'); // Track animation class
  const router = useRouter(); // Initialize router

  const handleToggleForm = (form) => {
    setFormClass('fade-out');
    setTimeout(() => {
      setCurrentForm(form);
      setFormClass('fade-in');
    }, 500); // Transition duration matches the CSS transition time
  };

  return (
    <div className="auth-container">
      {/* Back Button in the top left corner */}
      <div className="back-button">
        <Button type="link" onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
          {t('authPage.back')}
        </Button>
      </div>

      <div className="auth-image">
        <img src="/v870-mynt-06.jpg" alt="Auth" />
      </div>

      <div className={`auth-form ${formClass}`}>
        {currentForm === 'login' && (
          <>
            <LoginForm setLoading={setLoading} />
            <div className="auth-footer">
              <span>{t('authPage.noAccount')} </span>
              <Button type="link" onClick={() => handleToggleForm('register')}>
                {t('authPage.signUp')}
              </Button>
              <br />
              <Button type="link" onClick={() => handleToggleForm('reset')}>
                {t('authPage.forgotPassword')}
              </Button>
            </div>
          </>
        )}
        {currentForm === 'register' && (
          <>
            <RegisterForm setLoading={setLoading} setActiveTab={() => handleToggleForm('login')} />
            <div className="auth-footer">
              <span>{t('authPage.alreadyHaveAccount')} </span>
              <Button type="link" onClick={() => handleToggleForm('login')}>
                {t('authPage.login')}
              </Button>
            </div>
          </>
        )}
        {currentForm === 'reset' && (
          <>
            <ResetPasswordForm setLoading={setLoading} />
            <div className="auth-footer">
              <span>{t('authPage.rememberPassword')} </span>
              <Button type="link" onClick={() => handleToggleForm('login')}>
                {t('authPage.login')}
              </Button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative; /* Added for positioning back button */
        }

        .back-button {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 3;
        }

        .auth-image {
          position: fixed;
          left: 0;
          top: 0;
          width: 50%;
          height: 100vh;
          background-color: #f0f0f0;
          z-index: 1;
        }

        .auth-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .auth-form {
          width: 50%;
          padding: 50px;
          background-color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          margin-left: 50%;
          z-index: 2;
          overflow-y: auto;
          max-height: 100vh;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .fade-in {
          opacity: 1;
          transform: translateX(0);
        }

        .fade-out {
          opacity: 0;
          transform: translateX(50%);
        }

        .auth-footer {
          text-align: center;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }

          .auth-image {
            position: relative;
            width: 100%;
            height: 50vh;
          }

          .auth-form {
            width: 100%;
            padding: 20px;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
