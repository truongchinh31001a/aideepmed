'use client';

import { useState, useEffect } from 'react';
import { Spin, Modal } from 'antd';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export default function ProfileDetail() {
  const { t } = useTranslation(); // Initialize translation hook
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to call API to fetch profile data based on ID
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/profiles/${id}`);
      const data = await response.json();
      setProfile(data.profile);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  // Categorize images based on predictions and ensure only status true images are shown
  const categorizeImages = (images, category) => {
    return images
      .filter(image => image.status) // Only show images where status is true
      .filter(image =>
        image.thirdPartyInfo?.predictions?.some(prediction =>
          prediction[0].toLowerCase().includes(category.toLowerCase())
        )
      );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!profile) {
    return <p>{t('profile.noProfile')}</p>; // Translated "No profile found"
  }

  const earImages = categorizeImages(profile.images, 'ear');
  const noseImages = categorizeImages(profile.images, 'nose');
  const throatImages = categorizeImages(profile.images, 'throat');

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto pt-20 px-4">
        {/* <h2 className="text-3xl font-bold text-center mb-6 mt-5">{profile.name}</h2> */}
        {/* Table Layout */}
        <div className="table-layout">
          {/* First Row - Ear (only if there are ear images) */}
          {earImages.length > 0 && (
            <div className="table-row">
              <div className="table-cell category-name">
                <h3 className="text-xl font-semibold">{t('profile.ear')}</h3> {/* Translated "Ear" */}
              </div>
              <div className="table-cell category-content">
                {earImages.map((image, index) => (
                  <div
                    key={index}
                    className="image-info-container"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.path}
                      alt={image.originalname}
                      className="category-image"
                    />
                    <div className="image-info">
                      {image.thirdPartyInfo?.predictions?.[0]?.[1] && (
                        <p className="text-gray-600">
                          <strong>{t('profile.diagnosis')}:</strong> {image.thirdPartyInfo.predictions[0][1]} {/* Translated "Diagnosis" */}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Second Row - Nose (only if there are nose images) */}
          {noseImages.length > 0 && (
            <div className="table-row">
              <div className="table-cell category-name">
                <h3 className="text-xl font-semibold">{t('profile.nose')}</h3> {/* Translated "Nose" */}
              </div>
              <div className="table-cell category-content">
                {noseImages.map((image, index) => (
                  <div
                    key={index}
                    className="image-info-container"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.path}
                      alt={image.originalname}
                      className="category-image"
                    />
                    <div className="image-info">
                      {image.thirdPartyInfo?.predictions?.[0]?.[1] && (
                        <p className="text-gray-600">
                          <strong>{t('profile.diagnosis')}:</strong> {image.thirdPartyInfo.predictions[0][1]} {/* Translated "Diagnosis" */}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Third Row - Throat (only if there are throat images) */}
          {throatImages.length > 0 && (
            <div className="table-row">
              <div className="table-cell category-name">
                <h3 className="text-xl font-semibold">{t('profile.throat')}</h3> {/* Translated "Throat" */}
              </div>
              <div className="table-cell category-content">
                {throatImages.map((image, index) => (
                  <div
                    key={index}
                    className="image-info-container"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image.path}
                      alt={image.originalname}
                      className="category-image"
                    />
                    <div className="image-info">
                      {image.thirdPartyInfo?.predictions?.[0]?.[1] && (
                        <p className="text-gray-600">
                          <strong>{t('profile.diagnosis')}:</strong> {image.thirdPartyInfo.predictions[0][1]} {/* Translated "Diagnosis" */}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedImage && (
          <div>
            <img
              src={selectedImage.path}
              alt={selectedImage.originalname}
              style={{ width: '100%', height: 'auto' }}
            />
            <h3 className="mt-4 text-lg font-semibold capitalize">
              {selectedImage.thirdPartyInfo?.predictions?.[0]?.[0] || t('profile.unknown')} {/* Translated "Unknown" */}
            </h3>
            {selectedImage.thirdPartyInfo?.predictions?.[0]?.[1] && (
              <p className="text-gray-600">
                <strong>{t('profile.diagnosis')}:</strong> {selectedImage.thirdPartyInfo.predictions[0][1]} {/* Translated "Diagnosis" */}
              </p>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .table-layout {
          display: table;
          width: 100%;
        }

        .table-row {
          display: table-row;
        }

        .table-cell {
          display: table-cell;
          vertical-align: top;
          padding: 16px;
          width: 50%;
        }

        .category-name {
          text-align: center; /* Center align the category names */
        }

        .category-content {
          padding-left: 20px;
        }

        .image-info-container {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          cursor: pointer;
        }

        .category-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          margin-right: 16px;
        }

        .image-info h3 {
          margin-bottom: 4px;
        }

        .image-info p {
          color: gray;
        }
      `}</style>
    </div>
  );
}
