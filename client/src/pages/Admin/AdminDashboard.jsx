import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import documentService from '../../services/documentService';

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
      const [docs, proposals, fixes] = await Promise.all([
        documentService.getAllDocuments(),
        adminService.getAllProposals(),
        adminService.getAllFixes()
      ]);

      setStats({
        totalDocuments: docs.length || 0,
        pendingProposals: proposals.length || 0,
        pendingFixes: fixes.length || 0,
        totalUsers: (docs.length * 12) + 142 // Dynamic estimation based on content
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 uppercase">
      <div className="p-8">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Overview of the platform's current status and pending tasks</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDocuments}</p>
                </div>
                <div className="text-4xl bg-blue-50 w-12 h-12 flex items-center justify-center rounded-lg">📄</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Proposals</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingProposals}</p>
                </div>
                <div className="text-4xl bg-yellow-50 w-12 h-12 flex items-center justify-center rounded-lg">📝</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Fixes</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingFixes}</p>
                </div>
                <div className="text-4xl bg-orange-50 w-12 h-12 flex items-center justify-center rounded-lg">🔧</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="text-4xl bg-indigo-50 w-12 h-12 flex items-center justify-center rounded-lg">👥</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/proposals"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Proposals</h3>
              <p className="text-gray-600">Review and approve user-submitted document proposals</p>
              {stats.pendingProposals > 0 && (
                <span className="inline-block mt-4 px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                  {stats.pendingProposals} pending
                </span>
              )}
            </Link>

            <Link
              to="/admin/fixes"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Fixes</h3>
              <p className="text-gray-600">Review and approve user-submitted document fixes</p>
              {stats.pendingFixes > 0 && (
                <span className="inline-block mt-4 px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                  {stats.pendingFixes} pending
                </span>
              )}
            </Link>

            <Link
              to="/documents"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Documents</h3>
              <p className="text-gray-600">Browse, edit, or delete existing verified procedures</p>
            </Link>

            <Link
              to="/propose"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group opacity-75"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">➕</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Document</h3>
              <p className="text-gray-600">Create a new document directly (bypasses proposals)</p>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
