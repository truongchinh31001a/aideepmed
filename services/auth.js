export const login = async (account, password) => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account, password }), // Only send account and password
        });

        const data = await response.json();
        return data; // Return the API response
    } catch (error) {
        return { success: false, message: 'An error occurred. Please try again.' };
    }
};


export const registerUser = async (account, password, name, avatar) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, password, name, avatar }), // Gửi dữ liệu form
    });

    const data = await response.json();
    return data; // Trả về phản hồi từ API
  } catch (error) {
    return { success: false, message: 'Có lỗi xảy ra. Vui lòng thử lại.' };
  }
};

