'use client';

import { Button, Avatar, Dropdown, message } from 'antd';
import { HomeOutlined, BarChartOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth, signOut } from '@/firebase.config';
import Link from 'next/link'; // Sử dụng Link của Next.js
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation(); 
  const [firebaseUser, setFirebaseUser] = useState(null); 
  const [mongoUser, setMongoUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
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
    const fetchUserData = async (user) => {
      try {
        const response = await fetch('/api/getUserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.uid }),
        });

        const data = await response.json();

        if (response.ok) {
          setMongoUser(data); 

          // Gọi API để kiểm tra vai trò admin
          const roleResponse = await fetch('/api/checkUserRole', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: user.uid }),
          });

          const roleData = await roleResponse.json();
          if (roleResponse.ok) {
            setIsAdmin(roleData.isAdmin); 
          }
        } else {
          console.error('Error fetching user details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
        fetchUserData(user);
      } else {
        setFirebaseUser(null);
        setMongoUser(null);
        setIsAdmin(false);
      }
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
    { key: 'about', icon: <InfoCircleOutlined />, label: <Link href="/about">{t('about')}</Link> },
  ];

  const userMenu = [
    { key: 'profile', label: <Link href="/profile">{t('profileu')}</Link> },
    { key: 'research', label: <Link href="/research">{t('search')}</Link> },
    isAdmin && { key: 'manage', label: <Link href="/dashboard">{t('manage')}</Link> }, 
    { key: 'logout', label: <Button type="text" onClick={handleLogout}>{t('logout')}</Button> },
  ].filter(Boolean); 

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
          <img src="../LOGO.png" alt={t('logo')} className="h-12 w-auto" style={{ maxWidth: '120px', marginRight: '20px', justifyContent: "center", alignItems: "center" }} />
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
        {firebaseUser ? (
          <Dropdown menu={{ items: userMenu }}>
            <div className="flex items-center cursor-pointer">
              <Avatar
                icon={<UserOutlined />}
                src={mongoUser?.image || firebaseUser.photoURL || '/default-avatar.png'}
              />
              <span className="ml-2">
                {mongoUser ? `${mongoUser.firstName} ${mongoUser.lastName}` : firebaseUser.displayName || firebaseUser.email}
              </span>
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

        .header-link {
          transition: color 0.3s ease, background-color 0.3s ease;
        }

        .header-link:hover {
          color: #1d4ed8;
          background-color: rgba(29, 78, 216, 0.1); /* Hiệu ứng đổi nền nhẹ khi hover */
        }

        .header-icon:hover {
          color: #1d4ed8; /* Đổi màu biểu tượng khi hover */
        }
      `}</style>
    </header>
  );
}
