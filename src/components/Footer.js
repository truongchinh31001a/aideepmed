'use client';
import { useState, useEffect } from 'react';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook for translations

export default function Footer() {
  const { t, i18n } = useTranslation(); // Initialize translation hook
  const [year, setYear] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Xác nhận đây là client-side
    setYear(new Date().getFullYear()); // Lấy năm hiện tại
  }, []);

  if (!isClient) {
    // Đợi client-side render xong
    return null;
  }

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {/* Social Media Icons */}
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="text-white text-2xl hover:text-blue-500" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="text-white text-2xl hover:text-blue-400" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined className="text-white text-2xl hover:text-pink-500" />
          </a>
        </div>

        {/* Quick Links */}
        <div className="mb-4">
          <a href="/about" className="text-white hover:text-gray-400 mx-2">{t('aboutUs')}</a>
          <a href="/contact" className="text-white hover:text-gray-400 mx-2">{t('contact')}</a>
          <a href="/privacy" className="text-white hover:text-gray-400 mx-2">{t('privacyPolicy')}</a>
          <a href="/terms" className="text-white hover:text-gray-400 mx-2">{t('termsOfService')}</a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400">
          © {year} Provide deep medicine unit
        </p>
      </div>
    </footer>
  );
}
