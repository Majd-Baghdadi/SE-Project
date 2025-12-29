import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import documentService from '../../services/documentService';
import Notification from '../../components/Notification';

export default function ManageProposedFixes() {
  const [fixes, setFixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFix, setSelectedFix] = useState(null);
  const [originalDoc, setOriginalDoc] = useState(null);
  const [fetchingDoc, setFetchingDoc] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const getModifiedDoc = () => {
    if (!originalDoc || !selectedFix) return null;

    return {
      ...originalDoc,
      steps: selectedFix.stepsProblem ? (selectedFix.stepsDetails ? [selectedFix.stepsDetails] : originalDoc.steps) : originalDoc.steps,
      docprice: selectedFix.priceProblem ? selectedFix.priceDetails : originalDoc.docprice,
      duration: selectedFix.timeProblem ? selectedFix.timeDetails : originalDoc.duration,
      relateddocs: selectedFix.relatedDocsProblem ? (selectedFix.relatedDocsDetails ? [selectedFix.relatedDocsDetails] : originalDoc.relateddocs) : originalDoc.relateddocs
    };
  };

  const renderDocPreview = (doc, title, type = 'original') => {
    const isModified = type === 'modified';
    const highlight = (field) => {
      if (!isModified || !selectedFix) return '';
      const problems = {
        steps: selectedFix.stepsProblem,
        docprice: selectedFix.priceProblem,
        duration: selectedFix.timeProblem,
        relateddocs: selectedFix.relatedDocsProblem
      };
      return problems[field] ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-400 ring-opacity-30' : '';
    };

    return (
      <div className={`flex flex-col h-full rounded-2xl border ${isModified ? 'bg-green-50/20 border-green-200' : 'bg-gray-50 border-gray-200'} overflow-hidden shadow-sm`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isModified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          <h3 className="font-bold uppercase tracking-wider text-xs">{title}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50">
            {isModified ? 'Merged View' : 'Live Data'}
          </span>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-3xl border border-gray-100 flex-shrink-0">
              📄
            </div>
            <div className="min-w-0">
              <h4 className="text-lg font-bold text-gray-900 truncate">{doc.docname}</h4>
              <p className="text-xs text-gray-500 font-medium">{doc.category || 'Official Document'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`p-3 rounded-xl border bg-white transition-all ${highlight('docprice')}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Price</p>
              <p className="text-sm font-bold text-gray-900">{doc.docprice || '0'} DA</p>
            </div>
            <div className={`p-3 rounded-xl border bg-white transition-all ${highlight('duration')}`}>
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Duration</p>
              <p className="text-sm font-bold text-gray-900">{doc.duration || 'N/A'}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border bg-white transition-all ${highlight('steps')}`}>
            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center justify-between">
              Procedure Steps
              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[9px] font-bold">
                {Array.isArray(doc.steps) ? doc.steps.length : '1'} Steps
              </span>
            </p>
            <div className="space-y-3">
              {Array.isArray(doc.steps) ? doc.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-600 leading-relaxed text-xs">{step}</p>
                </div>
              )) : <p className="text-gray-600 text-xs">{doc.steps || 'No steps defined'}</p>}
            </div>
          </div>

          <div className={`p-4 rounded-xl border bg-white transition-all ${highlight('relateddocs')}`}>
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Required Documents</p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(doc.relateddocs) ? doc.relateddocs.map((rd, i) => (
                <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[11px] text-gray-600 font-medium">
                  {rd}
                </span>
              )) : <span className="text-xs text-gray-500 italic">None specified</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          docid: '1',
          title: 'Incorrect step in Passport Renewal',
          documentName: 'Passport Renewal',
          submittedBy: 'user@example.com',
          submittedDate: '2025-12-03',
          status: 'pending',
          problemTypes: ['steps', 'documents'],
          description: 'Step 3 mentions wrong office location. The required photos should be 4x6, not 3x4.'
        },
        {
          id: '2',
          docid: '3',
          title: 'Wrong price for Birth Certificate',
          documentName: 'Birth Certificate',
          submittedBy: 'jane@example.com',
          submittedDate: '2025-12-06',
          status: 'pending',
          problemTypes: ['price'],
          description: 'Listed price is outdated, should be 500 DA instead of the previous 200 DA.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (fixId, data) => {
    try {
      await adminService.validateFix(fixId, data);
      // Update UI immediately by removing the approved fix from the list
      setFixes(prevFixes => prevFixes.filter(f => (f.fixid || f.id) !== fixId));
      setNotification({ message: 'Fix approved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error approving fix:', error);
      setNotification({ message: 'Failed to approve fix. Please try again.', type: 'error' });
    }
  };

  const handleReject = async (fixId) => {
    try {
      await adminService.discardFix(fixId);
      // Immediate UI update to remove the rejected fix from the list
      setFixes(prevFixes => prevFixes.filter(f => (f.fixid || f.id) !== fixId));
      setNotification({ message: 'Fix rejected successfully!', type: 'success' });
    } catch (error) {
      console.error('Error rejecting fix:', error);
      setNotification({ message: 'Failed to reject fix. Please try again.', type: 'error' });
    }
  };

  const handleViewDetails = async (fix) => {
    setSelectedFix(fix);
    setFetchingDoc(true);
    try {
      if (fix.docid) {
        const response = await documentService.getDocumentById(fix.docid);
        // Backend returns { data: {...}, relatedDocuments: [...] }
        setOriginalDoc(response.data || response);
      }
    } catch (error) {
      console.error('Error fetching original document:', error);
      setOriginalDoc(null);
    } finally {
      setFetchingDoc(false);
    }
  };

  const filteredFixes = fixes.filter(f => {
    const docName = f.documents?.docname || '';
    const userName = f.users?.name || '';
    const title = f.title || ''; // title might not be in the select, but keeping it as fallback

    return docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase());
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFixes.map((fix) => (
                  <tr key={fix.fixid || fix.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{fix.title || 'No Title'}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{fix.description || 'No description provided'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fix.documents?.docname || 'Unknown Document'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {fix.problemTypes ? fix.problemTypes.map(type => (
                          <span key={type} className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                            {type}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-400italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fix.users?.name || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ID: {fix.fixid || fix.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Pending
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(fix)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <>
                        <button
                          onClick={() => handleApprove(fix.fixid || fix.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(fix.fixid || fix.id)}
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

            {filteredFixes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No fixes found matching your criteria.
              </div>
            )}
          </div>

          {/* Details Modal */}
          {selectedFix && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFix.title || 'Fix Proposal'}</h2>
                    <p className="text-sm text-gray-500 mt-1">Comparing proposed changes with live document</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-3xl leading-none">×</span>
                  </button>
                </div>

                {/* Modal Body - Full Comparison */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100/30">
                  {fetchingDoc ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading document comparison...</p>
                    </div>
                  ) : originalDoc ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-full">
                      {/* Original Copy */}
                      {renderDocPreview(originalDoc, 'Existing Live Document', 'original')}

                      {/* Merged Modified Copy */}
                      {renderDocPreview(getModifiedDoc(), 'Proposed Resulting Document', 'modified')}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 italic">
                      <span className="text-4xl mb-4">⚠️</span>
                      <p>Original document could not be loaded for comparison.</p>
                      <button onClick={() => fetchFixes()} className="mt-4 text-primary font-bold underline">Try Refreshing List</button>
                    </div>
                  )}
                </div>

                {/* Additional Context Bar */}
                <div className="px-8 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">User's Feedback</span>
                    <p className="text-sm text-gray-600 italic">"{selectedFix.description || 'No detailed explanation provided'}"</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedFix.stepsProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Steps Changed"></span>}
                    {selectedFix.priceProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Price Changed"></span>}
                    {selectedFix.timeProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Duration Changed"></span>}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedFix.fixid || selectedFix.id);
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors"
                  >
                    Discard Fix
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedFix.fixid || selectedFix.id, originalDoc);
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-10 py-2.5 bg-green-600 text-white hover:bg-green-700 font-bold rounded-xl transition-all shadow-lg shadow-green-200 transform hover:-translate-y-0.5"
                  >
                    Apply Fix
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
