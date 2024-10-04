'use client';

import { Button, Avatar, Dropdown, message } from 'antd';
import { HomeOutlined, BarChartOutlined, InfoCircleOutlined, FileSearchOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, signOut } from '@/firebase.config';
import Link from 'next/link'; // Sử dụng Link của Next.js
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next'; // Thêm useTranslation

export default function Header() {
  const { t } = useTranslation(); // Sử dụng t để dịch các chuỗi
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success(t('logout_success'));
      router.push('/');
    } catch (error) {
      message.error(t('logout_error'));
    }
  };

  const items = [
    { key: 'home', icon: <HomeOutlined />, label: <Link href="/">{t('home')}</Link> },
    { key: 'metrics', icon: <BarChartOutlined />, label: <Link href="/metrics">{t('metrics')}</Link> },
    { key: 'research', icon: <FileSearchOutlined />, label: <Link href="/research">{t('search')}</Link> },
    { key: 'about', icon: <InfoCircleOutlined />, label: <Link href="/about">{t('about')}</Link> },
  ];

  const userMenu = [
    { key: 'profile', label: <Link href="/profile">{t('profileu')}</Link> },
    { key: 'manage', label: <Link href="/dashboard">{t('manage')}</Link>},
    { key: 'logout', label: <Button type="text" onClick={handleLogout}>{t('logout')}</Button> },
  ];

  return (
    <header
      className="p-4 flex justify-between items-center bg-white border-b border-gray-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1000,
      }}
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center header-link">
          <img src="../logo192.png" alt={t('logo')} className="h-12 w-auto" style={{ maxWidth: '120px', marginRight: '20px' }} />
        </Link>
        <nav className="hidden md:flex space-x-8">
          {items.map(item => (
            <Link key={item.key} href={item.label.props.href} className="flex items-center header-link">
              <span className="header-icon" style={{ marginRight: '5px' }}>{item.icon}</span>
              {item.label.props.children}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        {user ? (
          <Dropdown menu={{ items: userMenu }}>
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} src={user.photoURL || '/default-avatar.png'} />
              <span className="ml-2">{user.displayName || user.email}</span>
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => router.push('/auth')}>
            {t('loginButton')}
          </Button>
        )}
      </div>
      <style jsx>{`
        .header-icon {
          color: #60a5fa;
          transition: color 0.3s ease;
        }
        .header-link {
          color: #60a5fa;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }
        .header-link:hover {
          color: #1d4ed8;
        }
        .header-link:hover .header-icon {
          color: #1d4ed8;
        }
      `}</style>
    </header>
  );
}
