import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Notification from '../../components/Notification';

export default function ManageProposedDocs() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

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
      // Update UI immediately by removing the approved proposal from the list
      setProposals(prevProposals => prevProposals.filter(p => (p.proposeddocid || p.id) !== proposalId));
      setNotification({ message: 'Proposal approved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error approving proposal:', error);
      setNotification({ message: 'Failed to approve proposal. Please try again.', type: 'error' });
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await adminService.discardProposal(proposalId);
      // Immediate UI update to remove the rejected proposal from the list
      setProposals(prevProposals => prevProposals.filter(p => (p.proposeddocid || p.id) !== proposalId));
      setNotification({ message: 'Proposal rejected successfully!', type: 'success' });
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      setNotification({ message: 'Failed to reject proposal. Please try again.', type: 'error' });
    }
  };

  const handleViewDetails = (proposal) => {
    setSelectedProposal(proposal);
  };

  const filteredProposals = proposals.filter(p => {
    const name = p.docname || p.docName || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: '' })}
      />
      <div className="p-8">
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
                    ID
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
                  <tr key={proposal.proposeddocid || proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {proposal.docpicture && (
                          <img
                            src={proposal.docpicture.startsWith('http') ? proposal.docpicture : `data:image/jpeg;base64,${proposal.docpicture}`}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-gray-200"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{proposal.docname || proposal.docName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ID: {proposal.proposeddocid || proposal.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Pending
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(proposal)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <>
                        <button
                          onClick={() => handleApprove(proposal.proposeddocid || proposal.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(proposal.proposeddocid || proposal.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
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
                  <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                    {selectedProposal.docpicture ? (
                      <img
                        src={selectedProposal.docpicture.startsWith('http') ? selectedProposal.docpicture : `data:image/jpeg;base64,${selectedProposal.docpicture}`}
                        alt={selectedProposal.docname}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image provided</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Proposal ID</h3>
                    <p className="text-gray-600">{selectedProposal.proposeddocid || selectedProposal.id}</p>
                  </div>
                </div>

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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
