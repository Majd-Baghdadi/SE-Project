import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingProposals: 0,
    pendingFixes: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Fallback to mock data
      setStats({
        totalDocuments: 45,
        pendingProposals: 8,
        pendingFixes: 12,
        totalUsers: 156
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage documents, proposals, and fixes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocuments}</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Proposals</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingProposals}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Fixes</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingFixes}</p>
              </div>
              <div className="text-4xl">🔧</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/add-document"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">➕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Document</h3>
            <p className="text-gray-600">Create a new document directly (bypasses proposals)</p>
          </Link>

          <Link
            to="/admin/proposals"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Proposals</h3>
            <p className="text-gray-600">Review and approve user-submitted document proposals</p>
            {stats.pendingProposals > 0 && (
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                {stats.pendingProposals} pending
              </span>
            )}
          </Link>

          <Link
            to="/admin/fixes"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Fixes</h3>
            <p className="text-gray-600">Review and approve user-submitted document fixes</p>
            {stats.pendingFixes > 0 && (
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                {stats.pendingFixes} pending
              </span>
            )}
          </Link>

          <Link
            to="/"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View All Documents</h3>
            <p className="text-gray-600">Browse and edit existing documents</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow opacity-50 cursor-not-allowed"
          >
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600">Coming soon...</p>
          </Link>

          <Link
            to="/admin/settings"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow opacity-50 cursor-not-allowed"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Coming soon...</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
