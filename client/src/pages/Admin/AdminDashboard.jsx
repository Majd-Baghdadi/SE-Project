import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FileText, Clock, Wrench, Users, ClipboardList, Settings, Plus, LayoutDashboard, Sparkles } from 'lucide-react';
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
      const [docs, proposals, fixes, usersCountResponse] = await Promise.all([
        documentService.getAllDocuments(),
        adminService.getAllProposals(),
        adminService.getAllFixes(),
        adminService.getUsersCount()
      ]);

      console.log('📊 Dashboard stats:', {
        docs: docs?.length,
        proposals: proposals?.length,
        fixes: fixes?.length,
        usersCount: usersCountResponse
      });

      setStats({
        totalDocuments: docs?.length || 0,
        pendingProposals: proposals?.length || 0,
        pendingFixes: fixes?.length || 0,
        totalUsers: usersCountResponse?.count || 0
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setStats({
        totalDocuments: 0,
        pendingProposals: 0,
        pendingFixes: 0,
        totalUsers: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-white/60 ml-14">Overview of the platform's current status and pending tasks</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Total Documents</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalDocuments}</p>
                </div>
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Pending Proposals</p>
                  <p className="text-3xl font-bold text-amber-400 mt-2">{stats.pendingProposals}</p>
                </div>
                <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7 text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Pending Fixes</p>
                  <p className="text-3xl font-bold text-orange-400 mt-2">{stats.pendingFixes}</p>
                </div>
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wrench className="w-7 h-7 text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/60">Contributing Users</p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/proposals"
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-emerald-500/50 transition-all duration-300 group no-underline"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/30 to-amber-600/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-7 h-7 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Proposals</h3>
              <p className="text-white/60 text-sm">Review and approve user-submitted document proposals</p>
              {stats.pendingProposals > 0 && (
                <span className="inline-flex items-center gap-1 mt-4 px-3 py-1.5 text-sm font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {stats.pendingProposals} pending
                </span>
              )}
            </Link>

            <Link
              to="/admin/fixes"
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-emerald-500/50 transition-all duration-300 group no-underline"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Fixes</h3>
              <p className="text-white/60 text-sm">Review and approve user-submitted document fixes</p>
              {stats.pendingFixes > 0 && (
                <span className="inline-flex items-center gap-1 mt-4 px-3 py-1.5 text-sm font-semibold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {stats.pendingFixes} pending
                </span>
              )}
            </Link>

            <Link
              to="/documents"
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-emerald-500/50 transition-all duration-300 group no-underline"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Manage Documents</h3>
              <p className="text-white/60 text-sm">Browse, edit, or delete existing verified procedures</p>
            </Link>

            <Link
              to="/propose"
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-emerald-500/50 transition-all duration-300 group no-underline"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Add New Document</h3>
              <p className="text-white/60 text-sm">Create a new document directly (bypasses proposals)</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
