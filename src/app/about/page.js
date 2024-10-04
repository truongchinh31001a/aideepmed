"use client";

import { Card, Row, Col, Avatar } from 'antd';

export default function AboutUs() {
  const teamMembers = [
    { name: 'John Doe', title: 'CEO', img: '/path/to/avatar1.jpg' },
    { name: 'Jane Smith', title: 'CTO', img: '/path/to/avatar2.jpg' },
    { name: 'Mike Johnson', title: 'CFO', img: '/path/to/avatar3.jpg' },
    { name: 'Emily Davis', title: 'COO', img: '/path/to/avatar4.jpg' },
    { name: 'Robert Wilson', title: 'Lead Developer', img: '/path/to/avatar5.jpg' },
    { name: 'Anna Brown', title: 'Product Manager', img: '/path/to/avatar6.jpg' },
    { name: 'Chris Green', title: 'Marketing Head', img: '/path/to/avatar7.jpg' },
  ];

  return (
    <div className="about-us-container">
      <h1 className="title">Meet Our Team</h1>
      <Row gutter={[16, 16]} justify="center">
        {teamMembers.slice(0, 5).map((member, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={4}>
            <Card hoverable className="team-card">
              <Avatar src={member.img} size={100} className="avatar" />
              <h3 className="name">{member.name}</h3>
              <p className="title">{member.title}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '20px' }}>
        {teamMembers.slice(5).map((member, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={4}>
            <Card hoverable className="team-card">
              <Avatar src={member.img} size={100} className="avatar" />
              <h3 className="name">{member.name}</h3>
              <p className="title">{member.title}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <style jsx>{`
        .about-us-container {
          text-align: center;
          padding: 100px 20px 40px 20px; /* Add padding-top to account for the header */
        }

        .title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .team-card {
          text-align: center;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 250px; /* Set a fixed width for the card */
          height: 300px; /* Set a fixed height for the card */
        }

        .avatar {
          margin-bottom: 15px;
        }

        .name {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .title {
          color: #777;
        }
      `}</style>
    </div>
  );
}
