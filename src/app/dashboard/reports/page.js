'use client';

import ReportTable from '@/components/ReportTable';

export default function ReportsPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Reports</h1>
      <ReportTable />
    </div>
  );
}
