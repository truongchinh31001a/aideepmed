'use client';

import UserTable from '@/components/UserTable';

export default function UsersPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
      <UserTable />
    </div>
  );
}
