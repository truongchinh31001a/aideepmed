'use client';

import { Layout, Menu } from 'antd';
import { UserOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

export default function DashboardMenu({ collapsed, onToggle }) {
  return (
    <>
      {/* Sidebar Menu */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onToggle}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          transition: 'width 0.3s ease',
        }}
      >
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link href="/">Home</Link> {/* Điều hướng về trang chủ */}
          </Menu.Item>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link href="/dashboard/users">User Management</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}>
            <Link href="/dashboard/reports">Report Management</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
}
