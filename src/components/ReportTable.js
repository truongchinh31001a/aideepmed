'use client';

import React, { useEffect, useState } from 'react';
import { Spin, Button, Modal, Checkbox, Input, DatePicker, Row, Col } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Store } from 'react-notifications-component';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { Search } = Input;
const { RangePicker } = DatePicker;

export default function ReportTable() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        Store.addNotification({
          title: 'Error!',
          message: 'Error fetching reports.',
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

    fetchReports();
  }, []);

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports((prevSelected) => {
      if (prevSelected.includes(reportId)) {
        return prevSelected.filter((id) => id !== reportId);
      } else {
        return [...prevSelected, reportId];
      }
    });
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      const allReportIds = reports.map((report) => report._id);
      setSelectedReports(allReportIds);
    } else {
      setSelectedReports([]);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    selectedReports.forEach((reportId) => {
      const report = reports.find((r) => r._id === reportId);
      if (report && report.imageDetails?.path) {
        zip.file(`${report.imageDetails.filename}`, fetch(report.imageDetails.path).then(res => res.blob()));
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'reports.zip');
    });

    Store.addNotification({
      title: 'Download initiated!',
      message: 'Your selected reports are being downloaded as a ZIP file.',
      type: 'info',
      insert: 'top',
      container: 'top-right',
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  };

  const handleSearch = (value) => {
    const filtered = reports.filter((report) =>
      report.comment.toLowerCase().includes(value.toLowerCase()) ||
      (report.user?.firstName && report.user.firstName.toLowerCase().includes(value.toLowerCase())) ||
      (report.user?.lastName && report.user.lastName.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredReports(filtered);
  };

  const handleDateFilter = (dates) => {
    setDateRange(dates);
    if (dates && dates.length === 2) {
      const [startDate, endDate] = dates;

      // Convert to JavaScript Date objects
      const start = new Date(startDate.toISOString());
      const end = new Date(endDate.toISOString());

      // Filter reports based on `createdAt`
      const filtered = reports.filter((report) => {
        const reportDate = new Date(report.createdAt);

        // Check if the report's date is within the selected range
        return reportDate >= start && reportDate <= end;
      });

      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
  };

  const columns = [
    { title: <Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />, dataIndex: 'select' },
    { title: 'No.', dataIndex: 'no' },
    { title: 'Image', dataIndex: 'image' },
    { title: 'Comment', dataIndex: 'comment' },
    { title: 'User', dataIndex: 'user' },
    { title: 'Date', dataIndex: 'createdAt' },
    { title: 'Action', dataIndex: 'action' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Report Management</h2>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Search
            placeholder="Search reports by comment or user"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
        </Col>
        <Col span={8}>
        </Col>
        <Col span={8}>
          <RangePicker
            size="large"
            style={{ width: '100%' }}
            onChange={handleDateFilter}
          />
        </Col>
      </Row>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="py-2 px-4 bg-gray-50 border-b font-semibold text-left text-gray-600">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report, index) => (
              <tr key={report._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">
                  <Checkbox
                    checked={selectedReports.includes(report._id)}
                    onChange={() => handleSelectReport(report._id)}
                  />
                </td>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">
                  {report.imageDetails?.path ? (
                    <img src={report.imageDetails.path} alt={report.imageDetails.originalname} style={{ width: '100px', height: 'auto' }} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="py-2 px-4 border-b" style={{ width: '40%' }}>{report.comment}</td>
                <td className="py-2 px-4 border-b">
                  {report.user ? (
                    <Button type="link" onClick={() => showModal(report.user)}>
                      {report.user.firstName} {report.user.lastName}
                    </Button>
                  ) : (
                    'Unknown User'
                  )}
                </td>
                <td className="py-2 px-4 border-b">{new Date(report.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  {report.imageDetails?.path ? (
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(report.imageDetails.path)}
                      className="text-blue-500 hover:underline"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="py-2 px-4 border-b text-center" colSpan={6}>
                No reports found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4">
        <Button type="primary" disabled={selectedReports.length === 0} onClick={handleDownloadZip}>
          Download Selected
        </Button>
      </div>

      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedUser ? (
          <div>
            <p><strong>Name:</strong> {selectedUser.firstName + " " + selectedUser.lastName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </Modal>
    </div>
  );
}
