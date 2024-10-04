'use client';

import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import DashboardMenu from '@/components/DashboardMenu';
import UserTable from '@/components/UserTable';
import ReportTable from '@/components/ReportTable';
import { usePathname } from 'next/navigation';
import { getAuth } from 'firebase/auth';

const { Content } = Layout;

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false); // Trạng thái của sidebar
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    async function fetchCurrentUser() {
      // Kiểm tra nếu người dùng đã đăng nhập
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();  // Lấy token của người dùng hiện tại
        const response = await fetch('/api/user/currentUser', {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        });
        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data); // Cập nhật người dùng hiện tại
        } else {
          console.error('Failed to fetch current user', data.message);
        }
      }
      setLoading(false); // Tắt trạng thái loading sau khi gọi API
    }

    fetchCurrentUser();
  }, [auth]);

  if (loading) {
    return <p>Loading...</p>; // Hiển thị loading khi đang lấy dữ liệu
  }

  if (!currentUser || !currentUser.isAdmin) {
    return <p>You do not have permission to access this page.</p>; // Kiểm tra quyền admin
  }

  // Hàm toggle để mở/đóng sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  let content;
  if (pathname === '/dashboard/users') {
    content = <UserTable currentUser={currentUser} />; // Truyền currentUser vào UserTable
  } else if (pathname === '/dashboard/reports') {
    content = <ReportTable currentUser={currentUser} />; // Truyền currentUser vào ReportTable
  } else {
    content = <div className="text-center text-gray-600">Select an option from the menu</div>;
  }

  return (
    <Layout>
      <DashboardMenu collapsed={collapsed} onToggle={toggleSidebar} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Điều chỉnh khoảng cách của nội dung dựa trên trạng thái của sidebar
          transition: 'margin-left 0.3s', // Thêm transition để tạo hiệu ứng khi mở/đóng sidebar
        }}
      >
        <Content className="p-6">
          {content}
        </Content>
      </Layout>
    </Layout>
  );
}
