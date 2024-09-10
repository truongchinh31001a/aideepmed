"use client";

import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import UploadArea from '@/components/UploadArea';
import ImagePreview from '@/components/ImagePreview';
import PredictionResult from '@/components/PredictionResult';
import LoadingSpinner from '@/components/LoadingSpinner';
import { createProfile } from '../../services/apiService'; // Import hàm API

export default function Home() {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [result, setResult] = useState(null); // Trạng thái hiển thị kết quả

  const handleChange = (info) => {
    setFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handlePreview = (file) => {
    setPreviewImage(URL.createObjectURL(file.originFileObj));
    setIsPreviewVisible(true);
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedFileList);
    message.success("File removed successfully.");
  };

  const handlePredict = async () => {
    if (fileList.length === 0) {
      message.error('Please upload images before predicting.');
      return;
    }

    setLoading(true);

    try {
      const data = await createProfile(fileList); // Gọi hàm API để gửi ảnh
      setResult(data); // Lưu lại kết quả trả về từ BE
      message.success('Prediction completed.');
    } catch (error) {
      message.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFileList([]);
    setResult(null); // Reset lại trạng thái kết quả
    message.info('Files cleared.');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container mx-auto py-10 px-4 text-center bg-white rounded-lg" style={{ width: '100%', maxWidth: '800px', paddingTop: '80px' }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {result && <PredictionResult result={result} />}
            {!result && (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-red-500">
                  AI-Assisted Diagnosis
                </h1>
                <p className="text-md sm:text-lg mb-8 text-blue-400">
                  in Otolaryngological Endoscopy
                </p>
                <UploadArea fileList={fileList} handleChange={handleChange} />
                {fileList.length > 0 && (
                  <ImagePreview fileList={fileList} handlePreview={handlePreview} handleRemove={handleRemove} />
                )}
              </>
            )}
          </>
        )}

        <Modal
          visible={isPreviewVisible}
          footer={null}
          onCancel={() => setIsPreviewVisible(false)}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        {!loading && !result && (
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              type="primary"
              onClick={handlePredict}
              disabled={fileList.length === 0}
              className="bg-blue-400 hover:bg-blue-500 border-none"
            >
              Predict
            </Button>

            {/* Chỉ hiển thị nút Clear khi fileList.length > 0 */}
            {fileList.length > 0 && (
              <Button
                type="danger"
                onClick={handleClear}
                className="bg-500 hover:bg-600 border-none"
              >
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
