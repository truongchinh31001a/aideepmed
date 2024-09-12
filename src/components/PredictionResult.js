import { Card, Button, Modal } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function PredictionResult({ result }) {
  const router = useRouter(); // Use useRouter for navigation
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!result || !result.profile || !result.profile.images) {
    return <p>No result available.</p>;
  }

  const { images } = result.profile;

  // Handle card click to open modal
  const handleCardClick = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
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
            onClick={() => handleCardClick(image)} // Handle card click
            className="shadow-lg mx-auto"
            style={{
              width: '230px', // Standard width for the card
              height: 'auto',
              borderRadius: '10px', // Rounded corners
              border: '2px solid red', // Red border for the card
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)', // Shadow box effect
            }}
          >
            <div className="text-center text-lg font-semibold">
              {image.thirdPartyInfo
                ? `Diagnosis: ${image.thirdPartyInfo.predictions[0][1]}`
                : 'No diagnosis available'}
            </div>
          </Card>
        ))}
      </div>

      {/* Back button to navigate to the home page */}
      <div className="mt-8 text-center">
        <Button
          type="primary"
          onClick={() => window.location.href = '/'} 
        >
          Back
        </Button>
      </div>

      {/* Modal to show image and details */}
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={handleModalClose}
        width={800} // Adjust the width of the modal
      >
        {selectedImage && (
          <div className="modal-content">
            {/* Left side: Image */}
            <div className="modal-image">
              <img
                alt={selectedImage.originalname}
                src={selectedImage.path}
                style={{ width: '100%', borderRadius: '10px' }}
              />
            </div>

            {/* Right side: Information */}
            <div className="modal-info">
              <h3>{selectedImage.thirdPartyInfo?.predictions?.[0]?.[0] || 'Unknown'}</h3>
              <p><strong>Original Name:</strong> {selectedImage.originalname}</p>
              {selectedImage.thirdPartyInfo?.predictions?.[0]?.[1] && (
                <p><strong>Diagnosis:</strong> {selectedImage.thirdPartyInfo.predictions[0][1]}</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr); /* 1 card per row for small screens */
          justify-items: center; /* Center the cards horizontally */
        }

        .single-card {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr); /* 2 cards per row for medium screens */
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr); /* 3 cards per row for large screens */
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
      `}</style>
    </>
  );
}
