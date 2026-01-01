import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Check, X, FileText, User, Clock, DollarSign, ClipboardList, AlertTriangle, Sparkles } from 'lucide-react';
import adminService from '../../services/adminService';
import proposalService from '../../services/proposalService';
import documentService from '../../services/documentService';
import standard from '../../assets/images/standard2.png';
import Notification from '../../components/Notification';

export default function ManageProposedDocs() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [docLookup, setDocLookup] = useState({});
  const [confirmReject, setConfirmReject] = useState(null);

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
      setProposals([
        {
          id: '1',
          docname: 'Tax Declaration Guide',
          doctype: 'Administrative Services',
          users: { name: 'demo@example.com', email: 'demo@example.com' },
          status: 'pending',
          duration: '10-15 days'
        },
        {
          id: '2',
          docname: 'Housing Certificate',
          doctype: 'Civil Status Services',
          users: { name: 'john@example.com', email: 'john@example.com' },
          status: 'pending',
          duration: '5-7 days'
        }
      ]);
      setNotification({ message: 'Failed to load proposals', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (proposalId) => {
    try {
      await adminService.validateProposal(proposalId);
      setProposals(prevProposals => prevProposals.filter(p => p.proposeddocid !== proposalId));
      setNotification({ message: 'Proposal approved successfully!', type: 'success' });
      if (selectedProposal?.proposeddocid === proposalId) {
        setSelectedProposal(null);
      }
    } catch (error) {
      console.error('Error approving proposal:', error);
      setNotification({ message: 'Failed to approve proposal. Please try again.', type: 'error' });
    }
  };

  const handleReject = async (proposalId) => {
    setConfirmReject(proposalId);
  };

  const confirmRejectAction = async (proposalId) => {
    try {
      await adminService.discardProposal(proposalId);
      setProposals(prevProposals => prevProposals.filter(p => p.proposeddocid !== proposalId));
      setNotification({ message: 'Proposal rejected successfully!', type: 'success' });
      if (selectedProposal?.proposeddocid === proposalId) {
        setSelectedProposal(null);
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      setNotification({ message: 'Failed to reject proposal. Please try again.', type: 'error' });
    } finally {
      setConfirmReject(null);
    }
  };

  const handleViewDetails = async (proposal) => {
    setSelectedProposal(proposal);
    setFetchingDetails(true);

    try {
      const id = proposal.proposeddocid;
      const response = await proposalService.getProposedDocumentDetails(id);

      if (response.success && response.data) {
        const proposalData = response.data;
        
        // Fetch related document names if there are relateddocs
        if (proposalData.relateddocs && Array.isArray(proposalData.relateddocs) && proposalData.relateddocs.length > 0) {
          // Fetch all documents to get names
          const allDocs = await documentService.getAllDocuments();
          const lookup = {};
          if (Array.isArray(allDocs)) {
            allDocs.forEach(d => {
              if (d.docid && d.docname) {
                lookup[d.docid] = d.docname;
              }
            });
          }
          
          // Map IDs to names
          const relatedDocsWithNames = proposalData.relateddocs.map(docId => ({
            docid: docId,
            docname: lookup[docId] || null
          }));
          proposalData.relateddocsWithNames = relatedDocsWithNames;
        }
        
        setSelectedProposal(prev => ({ ...prev, ...proposalData }));
      }
    } catch (error) {
      console.error('handleViewDetails error:', error);
      setNotification({ message: 'Failed to load proposal details', type: 'error' });
    } finally {
      setFetchingDetails(false);
    }
  };

  const filteredProposals = proposals.filter(p => {
    const name = p.docname || '';
    const category = p.doctype || '';
    const userName = p.users?.name || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      userName.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Manage Proposed Documents</h1>
            </div>
            <p className="text-white/60 ml-14">Review and approve user-submitted document proposals</p>
          </div>

          {/* Search Filter */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by name, category, or submitter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Proposals Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.proposeddocid} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {proposal.docpicture && (
                            <img
                              src={getImgSrc(proposal.docpicture)}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-white/20"
                            />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-white">{proposal.docname}</div>
                            <div className="text-xs text-white/50">{proposal.doctype || 'Uncategorized'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{proposal.users?.name || 'Unknown User'}</div>
                          <div className="text-xs text-white/50">{proposal.users?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(proposal)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 font-medium transition-colors border border-blue-500/30 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleApprove(proposal.proposeddocid || proposal.id)}
                            className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(proposal.proposeddocid || proposal.id)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProposals.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60">No proposals found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Details Modal */}
          {selectedProposal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 shadow-2xl">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedProposal.docname}</h2>
                    <p className="text-white/50 mt-1">Proposal Review</p>
                  </div>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8">
                  {fetchingDetails ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-white/50">Loading full details...</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Top Section: Image & Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Image */}
                        <div className="col-span-1">
                          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 bg-white/5">
                            <img
                              src={getImgSrc(selectedProposal.docpicture)}
                              alt={selectedProposal.docname}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="col-span-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Category</span>
                              <span className="font-semibold text-white">{selectedProposal.doctype || 'Uncategorized'}</span>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Submitted By</span>
                              <span className="font-semibold text-white">{selectedProposal.users?.name || 'Unknown'}</span>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Price</span>
                              <span className="font-semibold text-emerald-400">{selectedProposal.docprice || '0'} DA</span>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
                              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Duration</span>
                              <span className="font-semibold text-blue-400">
                                {selectedProposal.duration != null && selectedProposal.duration !== ''
                                  ? `${selectedProposal.duration} days`
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Related Docs */}
                          <div className="p-5 bg-white/10 rounded-xl border border-white/20">
                            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">Required Documents</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedProposal.relateddocsWithNames && Array.isArray(selectedProposal.relateddocsWithNames) && selectedProposal.relateddocsWithNames.length > 0 ? (
                                selectedProposal.relateddocsWithNames.map((doc, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg text-sm font-medium border border-white/20">
                                    {doc.docname || doc.docid}
                                  </span>
                                ))
                              ) : selectedProposal.relateddocs && Array.isArray(selectedProposal.relateddocs) && selectedProposal.relateddocs.length > 0 ? (
                                selectedProposal.relateddocs.map((docId, idx) => (
                                  <span key={idx} className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg text-sm font-medium border border-white/20">
                                    {docLookup[docId] || docId}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-white/40 italic">No related documents specified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Steps Section */}
                      <div className="bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                          <h3 className="font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xs">✓</span>
                            Procedure Steps
                          </h3>
                        </div>
                        <div className="p-6">
                          {selectedProposal.steps && Array.isArray(selectedProposal.steps) && selectedProposal.steps.length > 0 ? (
                            <div className="space-y-4">
                              {selectedProposal.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/30">
                                    {idx + 1}
                                  </span>
                                  <p className="text-white/80 leading-relaxed mt-1">{step}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-white/40 italic">No steps provided.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-end items-center gap-3">
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="px-6 py-2.5 text-white/70 font-semibold hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProposal.proposeddocid);
                      setSelectedProposal(null);
                    }}
                    className="px-6 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedProposal.proposeddocid);
                      setSelectedProposal(null);
                    }}
                    className="px-10 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 font-bold rounded-xl transition-all"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rejection Confirmation Modal */}
          {confirmReject && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-md w-full border border-white/20 shadow-2xl overflow-hidden">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Confirm Rejection</h3>
                  <p className="text-white/60 mb-6">
                    Are you sure you want to reject this proposal? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setConfirmReject(null)}
                      className="px-6 py-2.5 bg-white/10 text-white font-semibold hover:bg-white/20 rounded-xl transition-colors border border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmRejectAction(confirmReject)}
                      className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/30 rounded-xl transition-all"
                    >
                      Yes, Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
