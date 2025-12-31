import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import proposalService from '../../services/proposalService';
import documentService from '../../services/documentService';
import standard from '../../assets/images/standard2.png';
import Notification from '../../components/Notification';
import Swal from 'sweetalert2';

export default function ManageProposedDocs() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [docLookup, setDocLookup] = useState({});
  const getImgSrc = (src) => {
    if (!src) return standard;
    const cleanSrc = src.toString().trim();
    if (cleanSrc.startsWith('http') || cleanSrc.includes('://')) return cleanSrc;
    if (cleanSrc.startsWith('data:')) return cleanSrc;
    return `data:image/jpeg;base64,${cleanSrc}`;
  };

  useEffect(() => {
    fetchProposals();
    fetchDocLookup();
  }, []);

  const fetchDocLookup = async () => {
    try {
      const docs = await documentService.getAllDocuments();
      if (Array.isArray(docs)) {
        const lookup = {};
        docs.forEach(d => {
          if (d.docid && d.docname) {
            lookup[d.docid] = d.docname;
          }
        });
        setDocLookup(lookup);
      }
    } catch (error) {
      console.error('Failed to fetch document lookup:', error);
    }
  };

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
          category: 'Administrative Services',
          submittedBy: 'user@example.com',
          submittedDate: '2025-12-01',
          status: 'pending',
          difficulty: 'Medium',
          duration: '10-15 days'
        },
        {
          id: '2',
          docName: 'Housing Certificate',
          category: 'Civil Status Services',
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
    const result = await Swal.fire({
      title: 'Approve Proposal?',
      text: "This document will be added to the live collection.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Approve it!'
    });

    if (result.isConfirmed) {
      try {
        await adminService.validateProposal(proposalId);
        setProposals(prevProposals => prevProposals.filter(p => (p.proposeddocid || p.id) !== proposalId));
        Swal.fire({
          title: 'Approved!',
          text: 'The document is now live.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error approving proposal:', error);
        Swal.fire('Error!', 'Failed to approve. Please try again.', 'error');
      }
    }
  };

  const handleReject = async (proposalId) => {
    const result = await Swal.fire({
      title: 'Reject Proposal?',
      text: "This will permanently remove the suggestion from the queue.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Reject it!'
    });

    if (result.isConfirmed) {
      try {
        await adminService.discardProposal(proposalId);
        setProposals(prevProposals => prevProposals.filter(p => (p.proposeddocid || p.id) !== proposalId));
        Swal.fire({
          title: 'Rejected!',
          text: 'Proposal has been removed.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error rejecting proposal:', error);
        Swal.fire('Error!', 'Failed to reject. Please try again.', 'error');
      }
    }
  };

  const handleViewDetails = async (proposal) => {
    setSelectedProposal(proposal);
    setFetchingDetails(true);
    try {
      const id = proposal.proposeddocid || proposal.id;
      const response = await proposalService.getProposedDocumentDetails(id);
      if (response.success) {
        setSelectedProposal(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Failed to fetch details:', error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const filteredProposals = proposals
    .filter(p => {
      const name = p.docname || p.docName || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = (a.docname || a.docName || '').toLowerCase();
      const nameB = (b.docname || b.docName || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: '' })}
      />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">Manage Proposed Documents</h1>
            <p className="text-sm md:text-base text-gray-600">Review and approve user-submitted document proposals</p>
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
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {proposal.docpicture && (
                          <img
                            src={getImgSrc(proposal.docpicture)}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-gray-200"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{proposal.docname || proposal.docName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium text-gray-900">{proposal.users?.name || proposal.submittedBy || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500">{proposal.users?.email}</div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Pending
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(proposal)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors border border-blue-200"
                        >
                          👁️ View
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApprove(proposal.proposeddocid || proposal.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium transition-colors border border-green-200"
                            title="Approve"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleReject(proposal.proposeddocid || proposal.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors border border-red-200"
                            title="Reject"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
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
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProposal.docname || selectedProposal.docName}</h2>
                    <p className="text-sm text-gray-500 mt-1">Proposal Review</p>
                  </div>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-3xl leading-none">×</span>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                  {fetchingDetails ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading full details...</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Top Section: Image & Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Image */}
                        <div className="col-span-1">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm relative">
                            <img
                              src={getImgSrc(selectedProposal.docpicture)}
                              alt={selectedProposal.docname}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="col-span-2 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</span>
                              <span className="font-semibold text-gray-900">{selectedProposal.doctype || selectedProposal.category || 'Uncategorized'}</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Submitted By</span>
                              <span className="font-semibold text-gray-900">{selectedProposal.users?.name || selectedProposal.submittedBy || 'Unknown'}</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Price</span>
                              <span className="font-semibold text-green-700">{selectedProposal.docprice || '0'} DA</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Duration</span>
                              <span className="font-semibold text-blue-700">{selectedProposal.duration ? `${selectedProposal.duration} days` : 'N/A'}</span>
                            </div>
                          </div>

                          {/* Related Docs */}
                          <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Required Documents</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedProposal.relateddocs && Array.isArray(selectedProposal.relateddocs) && selectedProposal.relateddocs.length > 0 ? (
                                selectedProposal.relateddocs.map((doc, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium border border-gray-200">
                                    {docLookup[doc] || doc}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400 italic">No related documents specified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Steps Section */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                          <h3 className="font-bold text-gray-900">Procedure Steps</h3>
                        </div>
                        <div className="p-6">
                          {selectedProposal.steps && Array.isArray(selectedProposal.steps) && selectedProposal.steps.length > 0 ? (
                            <div className="space-y-4">
                              {selectedProposal.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                  </span>
                                  <p className="text-gray-700 leading-relaxed mt-1">{step}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic">No steps provided.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-3">
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProposal.proposeddocid || selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                    className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedProposal.proposeddocid || selectedProposal.id);
                      setSelectedProposal(null);
                    }}
                    className="px-10 py-2.5 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition-all shadow-lg shadow-green-200 transform hover:-translate-y-0.5"
                  >
                    Approve
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
