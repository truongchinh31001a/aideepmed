'use client';

import { Button, message } from 'antd';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase.config';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter để điều hướng

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Khởi tạo useRouter để điều hướng

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // Đăng nhập bằng Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Gửi thông tin người dùng lên server
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName.split(' ')[0],
          lastName: user.displayName.split(' ')[1] || '',
          uid: user.uid,
          image: user.photoURL,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Welcome ${user.displayName}!`);
        router.push('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
      } else {
        message.error(data.message || 'Failed to log in with Google');
      }
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      message.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      type="default"
      block
      style={{ width: '300px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      loading={loading}
    >
      <img src="/google-logo.png" alt="Google logo" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
      Google
    </Button>
  );
};

export default GoogleLoginButton;
