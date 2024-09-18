import { useState, useEffect } from 'react';
import { HomeOutlined, BarChartOutlined, InfoCircleOutlined, FileSearchOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Button, Avatar, message } from 'antd';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null); 
  const router = useRouter(); 

  // Kiểm tra token và lấy thông tin người dùng
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      if (token) {
        try {
          const response = await fetch('/api/auth/session', {
            headers: {
              'Authorization': `Bearer ${token}` // Gửi token trong header
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user); // Lưu thông tin người dùng
          } else {
            localStorage.removeItem('token'); // Xóa token nếu không hợp lệ
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    checkSession();

    const handleMouseMove = (event) => {
      if (event.clientY <= 50) {
        setShowHeader(true);
      }
    };

    const handleScroll = () => {
      if (window.scrollY < lastScrollY || window.scrollY === 0) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const items = [
    {
      key: 'home',
      icon: <HomeOutlined className="header-icon" />,
      label: <a href="/">Home</a>,
    },
    {
      key: 'metrics',
      icon: <BarChartOutlined className="header-icon" />,
      label: <a href="/metrics">Metrics</a>,
    },
    {
      key: 'research',
      icon: <FileSearchOutlined className="header-icon" />,
      label: <a href="/research">Research</a>,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined className="header-icon" />,
      label: <a href="/about">About</a>,
    },
  ];

  const handleLoginClick = () => {
    router.push('/auth'); // Điều hướng đến trang đăng nhập
  };

  const handleLogout = async () => {
    localStorage.removeItem('token'); // Xóa token khi đăng xuất
    setUser(null);
    message.success('Logout successful');
    router.push('/');
  };

  const userMenu = [
    {
      key: 'profile',
      label: <a href="/profile">Profile</a>,
    },
    {
      key: 'logout',
      label: <Button type="text" onClick={handleLogout}>Logout</Button>,
    },
  ];

  return (
    <header
      className="bg-white p-4 flex justify-between items-center border-b border-gray-300"
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
        <a href="/" className="flex items-center header-link">
          <img src="../logo192.png" alt="Logo" className="h-12 w-auto" style={{ maxWidth: '120px' }} />
        </a>

        <nav className="hidden md:flex space-x-8">
          {items.map(item => (
            <a key={item.key} href={item.label.props.href} className="flex items-center header-link">
              <span className="header-icon" style={{ marginRight: '5px' }}>{item.icon}</span>
              {item.label.props.children}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="md:hidden">
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button
              icon={<MenuOutlined className="header-icon" />}
              type="text"
              className="text-black focus:outline-none"
            />
          </Dropdown>
        </div>

        {user ? (
          <Dropdown menu={{ items: userMenu }}>
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} src={user.avatar || '/default-avatar.png'} />
              <span className="ml-2">{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLoginClick}>
            Login
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
