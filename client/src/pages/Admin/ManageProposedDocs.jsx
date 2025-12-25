import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function ManageProposedDocs() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllProposals();
      setProposals(data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      // Fallback to mock data if API fails
      setProposals([
        {
          id: '1',
          docName: 'Tax Declaration Guide',
          category: 'Legal',
          submittedBy: 'user@example.com',
          submittedDate: '2025-12-01',
          status: 'pending',
          difficulty: 'Medium',
          duration: '10-15 days'
        },
        {
          id: '2',
          docName: 'Housing Certificate',
          category: 'Civil Status',
          submittedBy: 'john@example.com',
          submittedDate: '2025-12-05',
          status: 'pending',
          difficulty: 'Easy',
          duration: '5-7 days'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (proposalId) => {
    try {
      await adminService.validateProposal(proposalId);
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'approved' } : p
      ));
      alert('Proposal approved successfully!');
    } catch (error) {
      console.error('Error approving proposal:', error);
      alert('Failed to approve proposal. Please try again.');
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await adminService.discardProposal(proposalId);
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'rejected' } : p
      ));
      alert('Proposal rejected successfully!');
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      alert('Failed to reject proposal. Please try again.');
    }
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
  };

  const filteredProposals = proposals.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Proposed Documents</h1>
          <p className="text-gray-600">Review and approve user-submitted document proposals</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or category..."
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

        {/* Proposals Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{proposal.docName}</div>
                    <div className="text-sm text-gray-500">{proposal.difficulty} • {proposal.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {proposal.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.submittedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {proposal.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(proposal)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {proposal.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(proposal.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(proposal.id)}
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
          
          {filteredProposals.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No proposals found matching your criteria.
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProposal.docName}</h2>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Category</h3>
                  <p className="text-gray-600">{selectedProposal.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Difficulty</h3>
                  <p className="text-gray-600">{selectedProposal.difficulty}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Duration</h3>
                  <p className="text-gray-600">{selectedProposal.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Submitted By</h3>
                  <p className="text-gray-600">{selectedProposal.submittedBy}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Submitted Date</h3>
                  <p className="text-gray-600">{selectedProposal.submittedDate}</p>
                </div>
                
                {/* TODO: Add more fields like requiredDocuments, steps, locationInfo */}
              </div>

              {selectedProposal.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      handleApprove(selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProposal.id);
                      setSelectedProposal(null);
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
