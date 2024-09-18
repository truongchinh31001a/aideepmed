import { Card, Button, Modal, Form, Input, message } from 'antd';
import { useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { submitReport } from 'services/submitReport';
import { useRouter } from 'next/navigation';

export default function PredictionResult({ result }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [comment, setComment] = useState('');
  const router = useRouter();  // Sử dụng router để chuyển hướng

  if (!result || !result.profile || !result.profile.images) {
    return <p>No result available.</p>;
  }

  const { images } = result.profile;

  // Mở modal khi nhấp vào ảnh
  const handleCardClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    setShowReportForm(false); // Reset form khi mở modal
  };

  // Đóng modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setComment(''); // Xóa comment khi đóng modal
  };

  // Mở form báo cáo
  const handleReportClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('You need to log in to submit a report');
      router.push('/auth');  // Chuyển hướng đến trang đăng nhập
    } else {
      setShowReportForm(true);
    }
  };

  // Gửi báo cáo
  const handleReportSubmit = async () => {
    const token = localStorage.getItem('token');
    const response = await submitReport(result.profile._id, selectedImage._id, comment, token);

    if (response.success) {
      message.success(response.message);
      setShowReportForm(false); // Ẩn form sau khi gửi thành công
      setComment('');  // Xóa comment sau khi gửi
    } else {
      message.error(response.message);
    }
  };

  const getDiagnosis = (image) => {
    if (image.thirdPartyInfo && image.thirdPartyInfo.predictions && image.thirdPartyInfo.predictions[0] && image.thirdPartyInfo.predictions[0][1]) {
      return image.thirdPartyInfo.predictions[0][1];
    }
    return 'No diagnosis available';
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-red-500 mb-4">Result</h1>
      <p className="text-lg text-blue-400 mb-4">Your diagnosis is as follows:</p>

      <div className={`grid ${images.length === 1 ? 'single-card' : ''}`}>
        {images.map((image, index) => (
          <Card
            key={index}
            hoverable
            cover={<img alt={image.originalname} src={image.path} />}
            onClick={() => handleCardClick(image)}
            className="shadow-lg mx-auto relative"
            style={{
              width: '230px',
              height: 'auto',
              borderRadius: '10px',
              border: '2px solid red',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="text-center text-lg font-semibold mb-8">
              {`Diagnosis: ${getDiagnosis(image)}`}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button type="primary" onClick={() => window.location.href = '/'}>
          Back
        </Button>
      </div>

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={handleModalClose}
        width={800}
      >
        {selectedImage && (
          <div className="modal-content">
            <div className="modal-image">
              <img
                alt={selectedImage.originalname}
                src={selectedImage.path}
                style={{ width: '100%', borderRadius: '10px' }}
              />
            </div>
            <div className="modal-info">
              <h3>status</h3>
              <h3>{selectedImage.thirdPartyInfo?.predictions?.[0]?.[0] || 'Unknown'}</h3>
              <p>
                <strong>Diagnosis:</strong> {getDiagnosis(selectedImage)}
              </p>

              {!showReportForm ? (
                <Button
                  icon={<WarningOutlined />}
                  onClick={handleReportClick}
                  className="report-button"
                >
                  Report
                </Button>
              ) : (
                <Form layout="vertical" style={{ marginTop: '20px' }}>
                  <Form.Item label="Comment">
                    <Input.TextArea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter your report comment here"
                      rows={4}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={handleReportSubmit}
                    style={{ marginTop: '10px' }}
                  >
                    Submit Report
                  </Button>
                </Form>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          justify-items: center;
          gap: 20px;
        }

        .single-card {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .modal-content {
          display: flex;
          gap: 24px;
        }

        .modal-image img {
          width: 100%;
          border-radius: 10px;
        }

        .modal-info {
          flex-grow: 1;
        }

        .modal-info h3 {
          font-size: 20px;
          margin-bottom: 12px;
        }

        .modal-info p {
          margin-bottom: 8px;
          font-size: 16px;
          color: gray;
        }

        .report-button {
          background-color: white;
          border: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .report-button:hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </>
  );
}
