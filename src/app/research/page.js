"use client"; // Đánh dấu đây là Client Component

import { useState, useEffect } from 'react';
import { Row, Col, Input, Checkbox, List, Card, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; // Import icon kính lúp

export default function ResearchPage() {
  const [profileData, setProfileData] = useState([]); // Dữ liệu hồ sơ từ API
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiện modal
  const [selectedImageInfo, setSelectedImageInfo] = useState(null); // Dữ liệu ảnh được chọn
  const [secondPrediction, setSecondPrediction] = useState(null); // Lưu dữ liệu thứ 2 từ predictions

  // Hàm gọi API từ server để lấy dữ liệu từ MongoDB
  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profiles'); // Gọi API từ `/api/profiles`
      const { profileData } = await response.json(); // Lấy dữ liệu từ response
      setProfileData(profileData); // Lưu lại dữ liệu vào state
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData(); // Gọi API khi component mount
  }, []);

  // Hiển thị modal khi ảnh được bấm
  const showModal = (imageInfo) => {
    setSelectedImageInfo(imageInfo); // Lưu thông tin ảnh được chọn

    // Kiểm tra và lấy phần tử thứ 2 từ `predictions` nếu có
    if (imageInfo.thirdPartyInfo && imageInfo.thirdPartyInfo.predictions && imageInfo.thirdPartyInfo.predictions[0]) {
      setSecondPrediction(imageInfo.thirdPartyInfo.predictions[0][1]); // Lấy phần tử thứ 2 từ `predictions`
    } else {
      setSecondPrediction(null); // Không có dữ liệu tại phần tử thứ 2
    }

    setIsModalVisible(true); // Hiện modal
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm và bộ lọc
  const filteredData = profileData.filter(item => {
    const matchesSearchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.images.some(img => img.originalname.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some(filter =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );

    return matchesSearchQuery && matchesFilter;
  });

  return (
    <div className="research-page">
      <Row gutter={[16, 16]} className="research-content">
        <Col xs={24} md={6} className="filter-section">
          <div className="filter-wrapper">
            <Card title="Tìm kiếm & Bộ lọc" className="mb-4">
              <Input.Search
                placeholder="Nhập từ khóa tìm kiếm..."
                enterButton={<SearchOutlined />} // Sử dụng icon kính lúp
                size="large"
                onSearch={handleSearch}
                className="mb-4"
              />

              <Checkbox.Group
                options={['Tai', 'Mũi', 'Họng']}
                onChange={handleFilterChange}
                className="mb-4"
                direction="vertical"
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={18}>
          <Card title="Kết quả tìm kiếm">
            <List
              itemLayout="vertical"
              size="large"
              dataSource={filteredData}
              renderItem={item => (
                <List.Item key={item._id}>
                  <List.Item.Meta
                    title={<h3>{item.name}</h3>}
                    description={(
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {item.images.map(image => (
                          <div key={image.filename} style={{ cursor: 'pointer' }}>
                            {/* Hiển thị hình ảnh xếp hàng ngang */}
                            {image.path && (
                              <img
                                src={image.path} // Đường dẫn ảnh từ MongoDB
                                alt={image.originalname} // Alt text cho ảnh
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} // Kích thước ảnh
                                onClick={() => showModal(image)} // Bấm vào ảnh hiện modal
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Modal hiện thông tin ảnh và tình trạng */}
      <Modal
        title="Thông tin hình ảnh"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedImageInfo && (
          <div>
            {/* Chỉ hiển thị ảnh nếu có */}
            {selectedImageInfo.path && (
              <img
                src={selectedImageInfo.path}
                alt={selectedImageInfo.originalname}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
            {/* Chỉ hiển thị tình trạng (phần tử thứ 2 từ predictions) nếu có */}
            {secondPrediction && (
              <div style={{ marginTop: '20px' }}>
                <p><strong>Tình trạng:</strong> {secondPrediction}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .research-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .research-content {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .filter-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
          position: sticky;
          top: 0;
          border-right: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}
