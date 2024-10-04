'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button, Result } from 'antd';
import DashboardMenu from '@/components/DashboardMenu';
import { ReactNotifications } from 'react-notifications-component';
import { getAuth } from 'firebase/auth';

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false); // State điều khiển menu
  const [currentUser, setCurrentUser] = useState(null); // Trạng thái người dùng hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');
  const auth = getAuth();

  // Hàm để toggle mở/đóng menu
  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken();  // Lấy token của người dùng hiện tại
          const response = await fetch('/api/user/currentUser', {
            headers: {
              Authorization: `Bearer ${token}`, // Truyền token vào headers
            },
          });
          const data = await response.json();

          if (response.ok) {
            setCurrentUser(data); // Lưu người dùng vào state
          } else {
            console.error('Failed to fetch current user:', data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false); // Tắt loading sau khi gọi API xong
      }
    }

    fetchCurrentUser();
  }, [auth]);

  if (loading) {
    return <p>Loading...</p>; // Hiển thị loading khi đang tải dữ liệu
  }

  if (!currentUser || !currentUser.isAdmin) {
    // Hiển thị Result nếu không có quyền
    return (
      <Result
        status="warning"
        title="You do not have permission to access this page."
        extra={
          <Button type="primary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Hiển thị DashboardMenu nếu là trang dashboard */}
      {isDashboardPage && <DashboardMenu collapsed={collapsed} onToggle={toggleMenu} />}

      {/* Phần nội dung chính của trang */}
      <div className={`flex-grow p-6 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </div>

      <ReactNotifications />
    </div>
  );
}
