"use client"; // Mark this as a Client Component

import { useState, useEffect } from 'react';
import { Row, Col, Input, Checkbox, List, Card, Button, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons'; 
import { useRouter } from 'next/navigation'; 

export default function ResearchPage() {
  const [profileData, setProfileData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expanded, setExpanded] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize] = useState(10); 
  const router = useRouter(); 

  // Fetch data from MongoDB and sort by creation date (newest to oldest)
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

  // Scroll to top function when the user changes page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  // Handle pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop(); // Scroll back to the top of the page when pagination changes
  };

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle filter changes
  const handleFilterChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
  };

  // Navigate to the profile detail page
  const handleProfileClick = (profileId) => {
    router.push(`/profiles/${profileId}`); 
  };

  // Filter data based on the search query and filters
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

  // Calculate the data to display on the current page
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="research-page">
      <Row gutter={[16, 16]} className="research-content">
        <Col xs={24} md={6} className="filter-section">
          <div className="filter-wrapper">
            <Card title="Search & Filters" className="mb-4">
              <Input.Search
                placeholder="Enter search keywords..."
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                className="mb-4"
              />

              <Checkbox.Group
                options={['Ear', 'Nose', 'Throat']}
                onChange={handleFilterChange}
                className="mb-4"
                direction="vertical"
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={18}>
          <Card title="Search Results">
            <List
              itemLayout="vertical"
              size="large"
              dataSource={paginatedData} // Only show paginated data
              renderItem={item => {
                const displayedImages = expanded ? item.images : item.images.slice(0, 5); // Show all images if expanded

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
                      title={(
                        <h3 className="item-name">
                          {item.name}
                        </h3>
                      )}
                      description={(
                        <div>
                          <p style={{ color: 'gray' }}>
                            Created on: {new Date(item.createdAt).toLocaleDateString('en-US')}
                          </p>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {displayedImages.map((image, index) => (
                              <div key={image.filename} style={{ position: 'relative' }}>
                                {image.path && (
                                  <img
                                    src={image.path}
                                    alt={image.originalname}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                  />
                                )}

                                {/* If there are more than 5 images, display "5+" on the last image */}
                                {!expanded && index === 4 && item.images.length > 5 && (
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
                                    +{item.images.length - 4}
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

            {/* Pagination Component */}
            <div className="pagination-container text-center mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length} // Total number of filtered profiles
                onChange={handlePageChange} // Update page when the user changes the page
              />
            </div>

          </Card>
        </Col>
      </Row>

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
        }

        .item-name {
          text-decoration: none;
          transition: text-decoration 0.3s ease;
        }

        .item-name:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
