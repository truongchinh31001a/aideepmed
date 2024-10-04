import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook

export default function UploadArea({ fileList, handleChange }) {
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation(); // Initialize translation hook

  useEffect(() => {
    setAnimate(true); // Trigger animation when component mounts
  }, []);

  return (
    <div className={`flex justify-center mb-6 ${animate ? 'animate-fadeIn' : ''}`}>
      <Upload.Dragger
        name="files"
        multiple={true}
        accept="image/*"
        fileList={fileList}
        onChange={handleChange}
        showUploadList={false}
        beforeUpload={() => false}
        className="rounded-lg p-6 hover:border-blue-500 transition-all duration-300 w-full md:w-[545px] hover:scale-105"
        style={{
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#29acf0',
          border: '2px dashed #29acf0',
        }}
      >
        <div>
          <p className="ant-upload-drag-icon">
            <UploadOutlined className="text-blue-400 text-3xl sm:text-4xl md:text-5xl mb-2 animate-bounce" />
          </p>
          <p className="text-blue-400 font-medium animate-fadeIn">
            {t('uploadArea.dragText')} {/* Use translation for the upload text */}
          </p>
        </div>
      </Upload.Dragger>

      <style jsx>{`
        .hover\:scale-105:hover {
          transform: scale(1.05);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
}
