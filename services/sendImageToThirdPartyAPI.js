// services/sendImageToThirdPartyAPI.js
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const sendImageToThirdPartyAPI = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath)); // Đọc file từ đường dẫn

    const response = await fetch('https://evolving-hardly-swift.ngrok-free.app/classify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to send image to third-party API. Status: ${response.status}`);
    }

    const result = await response.json();
    return result; // Kết quả trả về từ API bên thứ ba
  } catch (error) {
    console.error('Error sending image to third-party API:', error.message);
    throw new Error(error.message);
  }
};
