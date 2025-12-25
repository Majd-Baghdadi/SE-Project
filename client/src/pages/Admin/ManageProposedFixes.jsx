import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

export default function ManageProposedFixes() {
  const [fixes, setFixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFix, setSelectedFix] = useState(null);

  useEffect(() => {
    fetchFixes();
  }, []);

  const fetchFixes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllFixes();
      setFixes(data);
    } catch (error) {
      console.error('Error fetching fixes:', error);
      // Fallback to mock data if API fails
      setFixes([
        {
          id: '1',
          title: 'Incorrect step in Passport Renewal',
          documentName: 'Passport Renewal',
          submittedBy: 'user@example.com',
          submittedDate: '2025-12-03',
          status: 'pending',
          problemTypes: ['steps', 'documents'],
          description: 'Step 3 mentions wrong office location'
        },
        {
          id: '2',
          title: 'Wrong price for Birth Certificate',
          documentName: 'Birth Certificate',
          submittedBy: 'jane@example.com',
          submittedDate: '2025-12-06',
          status: 'pending',
          problemTypes: ['price'],
          description: 'Listed price is outdated, should be 500 DA'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (fixId) => {
    try {
      await adminService.validateFix(fixId);
      setFixes(fixes.map(f => 
        f.id === fixId ? { ...f, status: 'approved' } : f
      ));
      alert('Fix approved successfully!');
    } catch (error) {
      console.error('Error approving fix:', error);
      alert('Failed to approve fix. Please try again.');
    }
  };

  const handleReject = async (fixId) => {
    try {
      await adminService.discardFix(fixId);
      setFixes(fixes.map(f => 
        f.id === fixId ? { ...f, status: 'rejected' } : f
      ));
      alert('Fix rejected successfully!');
    } catch (error) {
      console.error('Error rejecting fix:', error);
      alert('Failed to reject fix. Please try again.');
    }
  };

  const handleViewDetails = (fix) => {
    setSelectedFix(fix);
  };

  const filteredFixes = fixes.filter(f => {
    const matchesFilter = filter === 'all' || f.status === filter;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.documentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Proposed Fixes</h1>
          <p className="text-gray-600">Review and approve user-submitted document fixes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Fixes Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fix Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFixes.map((fix) => (
                <tr key={fix.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{fix.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{fix.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {fix.documentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {fix.problemTypes.map(type => (
                        <span key={type} className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fix.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {fix.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      fix.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      fix.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fix.status.charAt(0).toUpperCase() + fix.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(fix)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {fix.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(fix.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(fix.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFixes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No fixes found matching your criteria.
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedFix && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedFix.title}</h2>
                <button
                  onClick={() => setSelectedFix(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Document</h3>
                  <p className="text-gray-600">{selectedFix.documentName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Problem Types</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedFix.problemTypes.map(type => (
                      <span key={type} className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600">{selectedFix.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Submitted By</h3>
                  <p className="text-gray-600">{selectedFix.submittedBy}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Submitted Date</h3>
                  <p className="text-gray-600">{selectedFix.submittedDate}</p>
                </div>
              </div>

              {selectedFix.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      handleApprove(selectedFix.id);
                      setSelectedFix(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedFix.id);
                      setSelectedFix(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
