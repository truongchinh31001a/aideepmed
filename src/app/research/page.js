"use client";

import { useState, useEffect } from 'react';
import { Row, Col, Input, Checkbox, List, Card, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next'; // Import the i18n hook
import diacritics from 'diacritics';

export default function ResearchPage() {
  const { t } = useTranslation(); // Initialize the translation function
  const [profileData, setProfileData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const router = useRouter();

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();
      const sortedData = data.profileData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProfileData(sortedData);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
    setCurrentPage(1);
  };

  const handleProfileClick = (profileId) => {
    router.push(`/profiles/${profileId}`);
  };

  const normalizeString = (str) => {
    return diacritics.remove(str.toLowerCase().replace(/[_\.]/g, '').replace(/\s+/g, ' '));
  };

  const filteredData = profileData.filter(item => {
    const validImages = item.images.filter(img => img.status);
    if (validImages.length === 0 || !item.isUser) { // Thêm điều kiện kiểm tra isUser
      return false;
    }

    const normalizedQuery = normalizeString(searchQuery);

    const matchesSearchQuery =
      normalizeString(item.name).includes(normalizedQuery) ||
      validImages.some(img =>
        normalizeString(img.originalname).includes(normalizedQuery) ||
        img.thirdPartyInfo.predictions.some(prediction =>
          normalizeString(prediction[1]).includes(normalizedQuery)
        )
      );

    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some(filter =>
        validImages.some(img =>
          img.thirdPartyInfo.predictions.some(prediction =>
            normalizeString(prediction[0]).includes(normalizeString(filter))
          )
        )
      );

    return matchesSearchQuery && matchesFilter;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="research-page">
      <Row gutter={[16, 16]} className="research-content">
        <Col xs={24} md={6} className="filter-section">
          <div className="filter-wrapper">
            <Card title={t('research.filters.title')} className="mb-4">
              <Input.Search
                placeholder={t('research.searchPlaceholder')} // Translated placeholder
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="mb-4"
              />
              <Checkbox.Group
                options={[
                  t('research.filters.ear'),
                  t('research.filters.nose'),
                  t('research.filters.throat'),
                ]}
                onChange={handleFilterChange}
                className="mb-4"
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={18}>
          <Card>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={paginatedData}
              renderItem={item => {
                const displayedImages = expanded ? item.images.filter(img => img.status) : item.images.filter(img => img.status).slice(0, 5);

                return (
                  <List.Item
                    key={item._id}
                    onClick={() => handleProfileClick(item._id)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: '#f0f0f0',
                      padding: '16px',
                      marginBottom: '16px',
                      borderRadius: '8px',
                      border: '1px solid #dcdcdc',
                    }}
                  >
                    <List.Item.Meta
                      description={(
                        <div>
                          <p style={{ color: 'gray' }}>
                            {t('research.createdOn')}: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {displayedImages.map((image, index) => (
                              <div key={image.filename} style={{ position: 'relative' }}>
                                <img
                                  src={image.path}
                                  alt={image.originalname}
                                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                                {!expanded && index === 4 && displayedImages.length > 5 && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                      color: 'white',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      fontSize: '24px',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    +{displayedImages.length - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    />
                  </List.Item>
                );
              }}
            />

            <div className="pagination-container text-center mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={handlePageChange}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .research-page {
          min-height: 100vh;
          padding: 0 16px;
          margin-top: 70px;
        }

        .research-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .filter-wrapper {
          position: sticky;
          top: 0;
          height: 100vh;
        }
      `}</style>
    </div>
  );
}
