import { useState, useEffect } from 'react';
import { HomeOutlined, BarChartOutlined, InfoCircleOutlined, FileSearchOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';

export default function Header() {
  const [showHeader, setShowHeader] = useState(true); // State để điều khiển hiển thị header
  const [lastScrollY, setLastScrollY] = useState(0);  // Theo dõi vị trí scroll cuối cùng

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.clientY <= 50) {
        setShowHeader(true);  // Hiển thị header khi chuột ở gần đầu trang
      }
    };

    const handleScroll = () => {
      if (window.scrollY < lastScrollY || window.scrollY === 0) {
        setShowHeader(true);  // Hiển thị header khi cuộn lên
      } else {
        setShowHeader(false); // Ẩn header khi cuộn xuống
      }
      setLastScrollY(window.scrollY);  // Cập nhật vị trí cuộn cuối cùng
    };

    window.addEventListener('mousemove', handleMouseMove); // Lắng nghe sự kiện di chuột
    window.addEventListener('scroll', handleScroll);       // Lắng nghe sự kiện cuộn trang

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const menu = (
    <Menu>
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="metrics" icon={<BarChartOutlined />}>
        <a href="/metrics">Metrics</a>
      </Menu.Item>
      <Menu.Item key="research" icon={<FileSearchOutlined />}>
        <a href="/research">Research</a>
      </Menu.Item>
      <Menu.Item key="about" icon={<InfoCircleOutlined />}>
        <a href="/about">About</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <header
      className="bg-white p-4 flex justify-between items-center border-b border-gray-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)', // Ẩn/Hiện header
        transition: 'transform 0.3s ease',
        zIndex: 1000,
      }}
    >
      {/* Logo và Menu cho Desktop */}
      <div className="flex items-center">
        <a href="/" className="flex items-center mr-8">
          <img src="../logo192.png" alt="Logo" className="h-12 w-auto" />
        </a>

        <nav className="hidden md:flex space-x-8">
          <a href="/" className="flex items-center gradient-hover">
            <HomeOutlined className="mr-2" />
            Home
          </a>
          <a href="/metrics" className="flex items-center gradient-hover">
            <BarChartOutlined className="mr-2" />
            Metrics
          </a>
          <a href="/research" className="flex items-center gradient-hover">
            <FileSearchOutlined className="mr-2" />
            Research
          </a>
          <a href="/about" className="flex items-center gradient-hover">
            <InfoCircleOutlined className="mr-2" />
            About
          </a>
        </nav>
      </div>

      {/* Dropdown Menu for Mobile */}
      <div className="md:hidden">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            icon={<MenuOutlined />}
            type="text"
            className="text-black focus:outline-none"
          />
        </Dropdown>
      </div>

      {/* Styles */}
      <style jsx>{`
        .gradient-hover {
          position: relative;
          display: inline-block;
          color: black;
          background-size: 200% 100%;
          background-image: linear-gradient(to right, cyan, cyan);
          background-position: -100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          transition: background-position 0.5s ease, color 0.5s ease;
        }

        .gradient-hover:hover {
          background-position: 0 0;
          color: transparent;
        }

        .gradient-hover svg {
          fill: currentColor;
        }
      `}</style>
    </header>
  );
}
