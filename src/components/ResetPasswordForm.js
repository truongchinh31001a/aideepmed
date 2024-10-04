'use client';

import { Form, Input, Button, message } from 'antd';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const ResetPasswordForm = ({ setLoading }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(t('resetPassword.successMessage')); // Translated message
      } else {
        message.error(data.message || t('resetPassword.errorMessage')); // Translated message
      }
    } catch (error) {
      message.error(t('resetPassword.errorOccurred')); // Translated error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="reset-heading">{t('resetPassword.title')}</h3> {/* Translated title */}
      <Form name="reset-password" onFinish={handleResetPassword} layout="vertical">
        <Form.Item
          label={t('resetPassword.emailLabel')} // Translated label
          name="email"
          rules={[{ required: true, message: t('resetPassword.emailPlaceholder') }]} // Translated placeholder message
        >
          <Input style={{ width: '300px', height: '40px' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '300px', height: '40px' }}>
            {t('resetPassword.sendButton')} {/* Translated button text */}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
