"use client"; // Đảm bảo đây là Client-Side Component

import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'January', pv: 2400, uv: 4000 },
  { name: 'February', pv: 1398, uv: 3000 },
  { name: 'March', pv: 9800, uv: 2000 },
  { name: 'April', pv: 3908, uv: 2780 },
  { name: 'May', pv: 4800, uv: 1890 },
  { name: 'June', pv: 3800, uv: 2390 },
  { name: 'July', pv: 4300, uv: 3490 },
];

export default function MetricsContent() {
  return (
    <div className="metrics-container container mx-auto py-10 px-4 flex-grow">
      <h1 className="text-2xl font-bold mb-8 text-center">Metrics Dashboard</h1>

      {/* Line and Bar Charts */}
      <Row gutter={[16, 16]}>
        {/* Line Chart */}
        <Col xs={24} sm={24} md={12}>
          <Card title="Line Chart Example">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Bar Chart */}
        <Col xs={24} sm={24} md={12}>
          <Card title="Bar Chart Example">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Statistics Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Users"
              value={1128}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sales"
              value={93}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="New Signups"
              value={35}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .metrics-container {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}
