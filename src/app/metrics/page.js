"use client"; // Đảm bảo rằng toàn bộ trang Metrics là Client-Side Component

import React from 'react';
import MetricsContent from '@/components/Metrics'; // Thành phần Metrics di chuyển sang file khác để dễ quản lý

export default function MetricsPage() {
  return (
    <div className="metrics-page flex flex-col min-h-screen">
      <MetricsContent />
    </div>
  );
}
