'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Avatar } from 'antd';
import { IdcardOutlined } from '@ant-design/icons';
import { Store } from 'react-notifications-component';
import { auth } from '@/firebase.config'; // Import Firebase auth để lấy uid người dùng hiện tại

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(''); // Thêm state để lưu thông báo xác nhận
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false); // Thêm state để hiển thị modal xác nhận
  const [currentUserUid, setCurrentUserUid] = useState(null); // Thêm state để lưu uid của người dùng hiện tại

  // Lấy thông tin người dùng hiện tại (uid)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserUid(user.uid); // Lưu uid của người dùng hiện tại
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch users từ API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users'); // Gọi API để lấy dữ liệu từ cả Firebase và MongoDB
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Hàm xóa người dùng
  async function handleDelete(user) {
    try {
      const deletePromises = [];

      if (user.id) {
        console.log('Deleting from Firebase with id:', user.id);
        const firebaseDeletePromise = fetch('/api/firebase/deleteUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.id }),
        });
        deletePromises.push(firebaseDeletePromise);
      }

      if (user.id) {
        console.log('Deleting from MongoDB with id:', user.id);
        const mongoDeletePromise = fetch('/api/mongodb/deleteUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: user.id }),
        });
        deletePromises.push(mongoDeletePromise);
      }

      const responses = await Promise.all(deletePromises);

      const firebaseResponse = responses[0];
      if (firebaseResponse && !firebaseResponse.ok) {
        const firebaseData = await firebaseResponse.json();
        throw new Error(`Firebase: ${firebaseData.message}`);
      }

      const mongoResponse = responses[1];
      if (mongoResponse && !mongoResponse.ok) {
        const mongoData = await mongoResponse.json();
        throw new Error(`MongoDB: ${mongoData.message}`);
      }

      setConfirmMessage(`User ${user.displayName} deleted successfully.`);
      setIsConfirmModalVisible(true);

      setUsers(users.filter((u) => u.id !== user.id));
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      Store.addNotification({
        title: 'Error!',
        message: `Failed to delete user: ${error.message}`,
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

  // Hàm edit người dùng
  async function handleEdit(uid) {
    const newPassword = prompt('Enter new password:');
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
          setIsConfirmModalVisible(true);
          setIsModalVisible(false);
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

  // Hiển thị modal với thông tin người dùng
  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  // Hủy hiển thị modal
  const handleCancel = () => {
    setIsModalVisible(false);
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
                {users
                  .filter((user) => user.id !== currentUserUid) // Lọc bỏ người dùng hiện tại
                  .map((user) => (
                    <tr key={user.id || user._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">
                        <Avatar src={user.photoURL} alt={user.displayName} />
                      </td>
                      <td className="py-2 px-4 border-b">{user.displayName || 'N/A'}</td>
                      <td className="py-2 px-4 border-b">{user.email}</td>
                      <td className="py-2 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{new Date(user.lastSignInTime).toLocaleDateString()}</td>
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

      <Modal title="User Details" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        {selectedUser && (
          <div style={{ textAlign: 'center' }}>
            <Avatar
              src={selectedUser.photoURL}
              size={100}
              alt={selectedUser.displayName}
              style={{ marginBottom: '20px' }}
            />
            <p>
              <strong>Name:</strong> {selectedUser.displayName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
            </p>
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
          </div>
        )}
      </Modal>

      {/* Modal xác nhận */}
      <Modal
        title="Confirmation"
        visible={isConfirmModalVisible}
        onOk={() => setIsConfirmModalVisible(false)}
        onCancel={() => setIsConfirmModalVisible(false)}
      >
        <p>{confirmMessage}</p>
      </Modal>
    </div>
  );
}
