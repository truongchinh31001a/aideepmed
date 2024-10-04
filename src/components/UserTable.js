'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Avatar } from 'antd'; // Import thêm Avatar từ Ant Design
import { IdcardOutlined } from '@ant-design/icons'; // Import biểu tượng Idcard
import { Store } from 'react-notifications-component'; // Import Store để hiển thị thông báo
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Trạng thái của modal xác nhận
  const [confirmMessage, setConfirmMessage] = useState(''); // Nội dung thông báo xác nhận

  // Lấy thông tin người dùng hiện tại
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/firebase/getUsers');
        const data = await response.json();

        // Lọc người dùng hiện tại khỏi danh sách
        const filteredUsers = data.filter(user => user.uid !== currentUser.uid);

        setUsers(filteredUsers || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchUsers(); // Chỉ fetch users khi có currentUser
    }
  }, [currentUser]);

  async function handleDelete(user) {
    try {
      const response = await fetch('/api/firebase/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid }), // Gửi uid của người dùng cần xóa
      });

      if (response.ok) {
        setConfirmMessage(`User ${user.firstName} ${user.lastName} deleted successfully.`); // Nội dung thông báo xác nhận
        setIsConfirmModalVisible(true); // Hiển thị modal xác nhận
        setUsers(users.filter((u) => u.uid !== user.uid)); // Xóa người dùng khỏi danh sách sau khi xóa thành công
        setIsModalVisible(false); // Ẩn modal chi tiết người dùng
      } else {
        const data = await response.json();
        Store.addNotification({
          title: 'Error!',
          message: `Failed to delete user: ${data.message}`,
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Store.addNotification({
        title: 'Error!',
        message: 'Error deleting user.',
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
    }
  }

  // Hàm chỉnh sửa mật khẩu người dùng
  async function handleEdit(uid) {
    const newPassword = prompt('Enter new password:'); // Yêu cầu nhập mật khẩu mới
    if (newPassword) {
      try {
        const response = await fetch('/api/firebase/updatePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid, newPassword }),
        });

        if (response.ok) {
          setConfirmMessage('Password updated successfully.');
          setIsConfirmModalVisible(true); // Hiển thị modal xác nhận
          setIsModalVisible(false); // Ẩn modal chi tiết người dùng
        } else {
          const data = await response.json();
          Store.addNotification({
            title: 'Error!',
            message: `Failed to update password: ${data.message}`,
            type: 'danger',
            insert: 'top',
            container: 'top-right',
            dismiss: {
              duration: 3000,
              onScreen: true,
            },
          });
        }
      } catch (error) {
        console.error('Error updating password:', error);
        Store.addNotification({
          title: 'Error!',
          message: 'Error updating password.',
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      }
    }
  }

  // Hàm phân quyền admin
  async function handleToggleAdmin(user) {
    try {
      const response = await fetch('/api/updateUserRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid: user.uid, isAdmin: !user.isAdmin }), // Toggle admin quyền
      });

      if (response.ok) {
        setConfirmMessage(`User ${user.firstName} ${user.lastName} is now ${!user.isAdmin ? 'an Admin' : 'a regular user'}.`);
        setIsConfirmModalVisible(true); // Hiển thị modal xác nhận
        setIsModalVisible(false); // Ẩn modal chi tiết người dùng

        // Cập nhật danh sách người dùng
        setUsers(users.map(u => 
          u.uid === user.uid ? { ...u, isAdmin: !user.isAdmin } : u
        ));
      } else {
        Store.addNotification({
          title: 'Error!',
          message: `Failed to update admin status.`,
          type: 'danger',
          insert: 'top',
          container: 'top-right',
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      Store.addNotification({
        title: 'Error!',
        message: 'Error updating admin status.',
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
    }
  }

  // Hiển thị modal với thông tin người dùng
  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Ẩn modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Ẩn modal xác nhận
  const handleConfirmModalClose = () => {
    setIsConfirmModalVisible(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">User Management</h2>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {users.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Avatar</th>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Name</th>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Email</th>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Created</th>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Signed in</th>
                  <th className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <Avatar src={user.photoURL} alt={user.displayName} /> {/* Ảnh đại diện */}
                    </td>
                    <td className="py-2 px-4 border-b">{user.displayName || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td> {/* Ngày tạo */}
                    <td className="py-2 px-4 border-b">{new Date(user.lastSignInTime).toLocaleDateString()}</td> {/* Ngày đăng nhập */}
                    <td className="py-2 px-4 border-b">
                      <Button type="link" icon={<IdcardOutlined />} onClick={() => showModal(user)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </>
      )}

      {/* Modal hiển thị thông tin chi tiết người dùng */}
      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Không có footer cho modal
      >
        {selectedUser && (
          <div style={{ textAlign: 'center' }}>
            {/* Ảnh đại diện trong modal */}
            <Avatar
              src={selectedUser.photoURL}
              size={100}
              alt={selectedUser.displayName}
              style={{ marginBottom: '20px' }}
            />
            <p><strong>Name:</strong> {selectedUser.displayName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Signed In:</strong> {new Date(selectedUser.lastSignInTime).toLocaleDateString()}</p>

            {/* Nút Edit và Delete */}
            <Button
              type="text"
              style={{ backgroundColor: 'white', color: 'blue', marginRight: '10px' }}
              onClick={() => handleEdit(selectedUser.uid)}
            >
              Reset password
            </Button>
            <Button
              type="text"
              style={{ backgroundColor: 'white', color: 'red' }}
              onClick={() => handleDelete(selectedUser)}
            >
              Delete
            </Button>

            {/* Nút phân quyền admin */}
            <Button
              type="text"
              style={{ backgroundColor: 'white', color: selectedUser.isAdmin ? 'green' : 'orange', marginTop: '10px' }}
              onClick={() => handleToggleAdmin(selectedUser)}
            >
              {selectedUser.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal xác nhận */}
      <Modal
        title="Confirmation"
        visible={isConfirmModalVisible}
        onOk={handleConfirmModalClose}
        onCancel={handleConfirmModalClose}
      >
        <p>{confirmMessage}</p>
      </Modal>
    </div>
  );
}
