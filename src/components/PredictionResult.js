'use client';

import { Card, Button, Modal, Form, Input } from 'antd';
import { useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase.config';
import { useTranslation } from 'react-i18next';
import { Store } from 'react-notifications-component'; // Import Store để dùng react-notifications-component

export default function PredictionResult({ result }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!result || !result.profile || !result.profile.images) {
    return <p>{t('result.noResult')}</p>;
  }

  const { images } = result.profile;

  const handleCardClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    setShowReportForm(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setComment('');
  };

  const handleReportClick = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Store.addNotification({
        title: t('result.loginWarning'),
        message: 'You need to log in to submit a report.',
        type: 'warning',
        insert: 'top',
        container: 'top-right',
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/auth');
    } else {
      setShowReportForm(true);
    }
  };

  const handleReportSubmit = async () => {
    if (!comment.trim()) {
      Store.addNotification({
        title: t('result.emptyCommentWarning'),
        message: 'Please fill in the comment field before submitting the report.',
        type: 'warning',
        insert: 'top',
        container: 'top-right',
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
      return;
    }

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error(t('result.loginWarning'));
      }

      const token = await currentUser.getIdToken();

      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId: result.profile._id,
          imageId: selectedImage._id,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Store.addNotification({
          title: t('result.reportSuccess'),
          message: 'Your report has been successfully submitted!',
          type: 'success',
          insert: 'top',
          container: 'top-right',
          dismiss: {
            duration: 3000,
            onScreen: true,
          },
        });
        setShowReportForm(false);
        setComment('');
        setIsModalOpen(false); // Đóng modal sau khi báo cáo thành công
      } else {
        Store.addNotification({
          title: 'Error',
          message: data.message || t('result.reportFailed'),
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
      console.error('Error submitting report:', error);
      Store.addNotification({
        title: 'Error',
        message: t('result.reportError'),
        type: 'danger',
        insert: 'top',
        container: 'top-right',
        dismiss: {
          duration: 3000,
          onScreen: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getDiagnosis = (image) => {
    if (image.thirdPartyInfo && image.thirdPartyInfo.predictions && image.thirdPartyInfo.predictions[0] && image.thirdPartyInfo.predictions[0][1]) {
      return image.thirdPartyInfo.predictions[0][1];
    }
    return t('result.noDiagnosis');
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-red-500 mb-4">{t('result.title')}</h1>
      <p className="text-lg text-blue-400 mb-4">{t('result.diagnosisIntro')}</p>

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
              {`${t('result.diagnosis')}: ${getDiagnosis(image)}`}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button type="primary" onClick={() => window.location.href = '/'}>
          {t('result.backButton')}
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
              <h3>{selectedImage.thirdPartyInfo?.predictions?.[0]?.[0] || t('result.unknownStatus')}</h3>
              <p>
                <strong>{t('result.diagnosis')}:</strong> {getDiagnosis(selectedImage)}
              </p>

              {!showReportForm ? (
                <Button
                  icon={<WarningOutlined />}
                  onClick={handleReportClick}
                  className="report-button"
                >
                  {t('result.reportButton')}
                </Button>
              ) : (
                <Form layout="vertical" style={{ marginTop: '20px' }}>
                  <Form.Item label="Comment">
                    <Input.TextArea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('result.commentPlaceholder')}
                      rows={4}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={handleReportSubmit}
                    loading={loading}
                    style={{ marginTop: '10px' }}
                  >
                    {t('result.submitReport')}
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
