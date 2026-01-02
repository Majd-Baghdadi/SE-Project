import { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Wrench, User, Clock, FileText, AlertTriangle, DollarSign, Image } from 'lucide-react';
import adminService from '../../services/adminService';
import proposalService from '../../services/proposalService';
import documentService from '../../services/documentService';
import Notification from '../../components/Notification';
import Swal from 'sweetalert2';

export default function ManageProposedFixes() {
  const [fixes, setFixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFix, setSelectedFix] = useState(null);
  const [originalDoc, setOriginalDoc] = useState(null);
  const [fetchingDoc, setFetchingDoc] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [fixSelections, setFixSelections] = useState({});

  const getModifiedDoc = () => {
    if (!originalDoc || !selectedFix) return null;
    const selections = fixSelections[selectedFix.fixid || selectedFix.id] || {};

    const stepsToUse = (selectedFix.stepsProblem && selections.steps)
      ? (selectedFix.stepsDetails ? selectedFix.stepsDetails : originalDoc.steps)
      : originalDoc.steps;

    const docsToUse = (selectedFix.relatedDocsProblem && selections.relateddocs)
      ? (selectedFix.relatedDocsNames ? selectedFix.relatedDocsNames : (selectedFix.relatedDocsDetails ? [selectedFix.relatedDocsDetails] : originalDoc.relateddocs))
      : originalDoc.relateddocs;

    const imageToUse = (selectedFix.docpicture && selections.image)
      ? selectedFix.docpicture
      : originalDoc.docpicture;

    return {
      ...originalDoc,
      steps: stepsToUse,
      docprice: (selectedFix.priceProblem && selections.price) ? selectedFix.priceDetails : originalDoc.docprice,
      duration: (selectedFix.timeProblem && selections.duration) ? selectedFix.timeDetails : originalDoc.duration,
      relateddocs: docsToUse,
      docpicture: imageToUse
    };
  };

  const renderDocPreview = (doc, title, type = 'original') => {
    const isModified = type === 'modified';
    const highlight = (field) => {
      if (!isModified || !selectedFix) return '';
      const selections = fixSelections[selectedFix.fixid || selectedFix.id] || {};
      const problems = {
        steps: selectedFix.stepsProblem && selections.steps,
        docprice: selectedFix.priceProblem && selections.price,
        duration: selectedFix.timeProblem && selections.duration,
        relateddocs: selectedFix.relatedDocsProblem && selections.relateddocs
      };
      return problems[field] ? 'ring-2 ring-amber-400/50 bg-amber-500/10' : '';
    };

    const toggleSelection = (field) => {
      const fixId = selectedFix.fixid || selectedFix.id;
      setFixSelections(prev => ({
        ...prev,
        [fixId]: {
          ...(prev[fixId] || {}),
          [field]: !prev[fixId]?.[field]
        }
      }));
    };

    const isSelectable = (field) => {
      if (!isModified || !selectedFix) return false;
      const mapped = {
        docprice: 'priceProblem',
        duration: 'timeProblem',
        steps: 'stepsProblem',
        relateddocs: 'relatedDocsProblem',
        image: 'docpicture'
      };
      
      // For image, check if the fix has a new docpicture
      if (field === 'image') {
        return !!selectedFix.docpicture;
      }
      
      return !!selectedFix[mapped[field]];
    };

    return (
      <div className={`flex flex-col h-full rounded-2xl border ${isModified ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/20'} overflow-hidden`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isModified ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
          <h3 className={`font-bold uppercase tracking-wider text-xs ${isModified ? 'text-emerald-400' : 'text-white/60'}`}>{title}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isModified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
            {isModified ? 'Merged View' : 'Live Data'}
          </span>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0">
              <FileText className="w-7 h-7 text-white/60" />
            </div>
            <div className="min-w-0">
              <h4 className="text-lg font-bold text-white truncate">{doc.docname}</h4>
              <p className="text-xs text-white/50 font-medium">{doc.category || 'Official Document'}</p>
            </div>
          </div>

          {/* Image Section */}
          {(originalDoc?.docpicture || selectedFix?.docpicture) && (
            <div
              className={`p-4 rounded-xl border bg-white/5 border-white/20 transition-all ${highlight('image')} ${isSelectable('image') ? 'cursor-pointer hover:border-amber-400/50' : ''}`}
              onClick={() => isSelectable('image') && toggleSelection('image')}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-white/60" />
                  <span className="text-sm font-semibold text-white/80">Document Image</span>
                </div>
                {isSelectable('image') && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    fixSelections[selectedFix.fixid || selectedFix.id]?.image
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-white/30'
                  }`}>
                    {fixSelections[selectedFix.fixid || selectedFix.id]?.image && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-white/40 uppercase tracking-wide font-semibold">Original</p>
                  {originalDoc?.docpicture ? (
                    <img 
                      src={originalDoc.docpicture} 
                      alt="Original document" 
                      className="w-full h-48 object-cover rounded-lg border border-white/10"
                    />
                  ) : (
                    <div className="w-full h-48 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                      <span className="text-white/30 text-sm">No image</span>
                    </div>
                  )}
                </div>
                {selectedFix?.docpicture && (
                  <div className="space-y-2">
                    <p className="text-xs text-emerald-400 uppercase tracking-wide font-semibold">Proposed</p>
                    <img 
                      src={selectedFix.docpicture} 
                      alt="Proposed fix" 
                      className="w-full h-48 object-cover rounded-lg border border-emerald-400/30"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-xl border bg-white/5 border-white/20 transition-all ${highlight('docprice')} ${isSelectable('docprice') ? 'cursor-pointer hover:border-amber-400/50' : ''}`}
              onClick={() => isSelectable('docprice') && toggleSelection('price')}
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Price</p>
                {isSelectable('docprice') && (
                  <input
                    type="checkbox"
                    checked={fixSelections[selectedFix.fixid || selectedFix.id]?.price}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                )}
              </div>
              <p className="text-sm font-bold text-emerald-400">{doc.docprice || '0'} DA</p>
            </div>
            <div
              className={`p-4 rounded-xl border bg-white/5 border-white/20 transition-all ${highlight('duration')} ${isSelectable('duration') ? 'cursor-pointer hover:border-amber-400/50' : ''}`}
              onClick={() => isSelectable('duration') && toggleSelection('duration')}
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Duration</p>
                {isSelectable('duration') && (
                  <input
                    type="checkbox"
                    checked={fixSelections[selectedFix.fixid || selectedFix.id]?.duration}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                )}
              </div>
              <p className="text-sm font-bold text-blue-400">{doc.duration || 'N/A'}</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border bg-white/5 border-white/20 transition-all ${highlight('steps')} ${isSelectable('steps') ? 'cursor-pointer hover:border-amber-400/50' : ''}`}
            onClick={() => isSelectable('steps') && toggleSelection('steps')}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                Procedure Steps
                <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {Array.isArray(doc.steps) ? doc.steps.length : '1'} Steps
                </span>
              </p>
              {isSelectable('steps') && (
                <input
                  type="checkbox"
                  checked={fixSelections[selectedFix.fixid || selectedFix.id]?.steps}
                  onChange={() => {}}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              )}
            </div>
            <div className="space-y-3">
              {Array.isArray(doc.steps) ? doc.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-white/70 leading-relaxed text-xs">{step}</p>
                </div>
              )) : <p className="text-white/50 text-xs">{doc.steps || 'No steps defined'}</p>}
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border bg-white/5 border-white/20 transition-all ${highlight('relateddocs')} ${isSelectable('relateddocs') ? 'cursor-pointer hover:border-amber-400/50' : ''}`}
            onClick={() => isSelectable('relateddocs') && toggleSelection('relateddocs')}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-white/40 uppercase">Required Documents</p>
              {isSelectable('relateddocs') && (
                <input
                  type="checkbox"
                  checked={fixSelections[selectedFix.fixid || selectedFix.id]?.relateddocs}
                  onChange={() => {}}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(doc.relateddocs) ? doc.relateddocs.map((rd, i) => (
                <span key={i} className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-[11px] text-white/70 font-medium">
                  {rd}
                </span>
              )) : <span className="text-xs text-white/40 italic">None specified</span>}
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
          description: 'Step 3 mentions wrong office location.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isValidUUID = (uuid) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  };

  const extractFixData = (res) => {
    if (!res) return null;
    let current = res.fix || (res.data && res.data.fix ? res.data.fix : res.data) || res;
    if (Array.isArray(current)) current = current[0];
    if (current && current.data && !current.docid) current = current.data;
    if (Array.isArray(current)) current = current[0];
    return current;
  };

  const handleApprove = async (fixId, providedData = null) => {
    let finalData = providedData;

    if (!finalData) {
      try {
        const fixRes = await proposalService.getProposedFixDetails(fixId);
        const fix = extractFixData(fixRes);

        if (!fix) {
          throw new Error('Fix details could not be found.');
        }

        const rawDocId = fix.docid || fix.docId || (fix.documents && (fix.documents.docid || fix.documents.id));

        if (!rawDocId || !isValidUUID(rawDocId)) {
          throw new Error('This fix is missing a valid link to a document.');
        }

        const docRes = await documentService.getDocumentById(rawDocId);
        const originalData = docRes.data || docRes;

        if (!originalData || !originalData.docname) {
          throw new Error('The original document could not be loaded.');
        }

        const selections = fixSelections[fixId] || {
          steps: !!fix.stepsProblem,
          price: !!fix.priceProblem,
          duration: !!fix.timeProblem,
          relateddocs: !!fix.relatedDocsProblem
        };

        const processSteps = (details, origSteps) => {
          if (!details) return Array.isArray(origSteps) ? origSteps : [];
          return typeof details === 'string' ? details.split('\n').filter(s => s.trim()) : (Array.isArray(details) ? details : [details]);
        };

        const processRelated = (details, origRelated) => {
          if (!details) return Array.isArray(origRelated) ? origRelated : [];
          return typeof details === 'string' ? details.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(details) ? details : [details]);
        };

        finalData = {
          ...originalData,
          steps: (fix.stepsProblem && selections.steps) ? processSteps(fix.stepsDetails, originalData.steps) : originalData.steps,
          docprice: (fix.priceProblem && selections.price) ? fix.priceDetails : originalData.docprice,
          duration: (fix.timeProblem && selections.duration) ? fix.timeDetails : originalData.duration,
          relateddocs: (fix.relatedDocsProblem && selections.relateddocs) ? processRelated(fix.relatedDocsDetails, originalData.relateddocs) : originalData.relateddocs,
          docname: originalData.docname || fix.documentName || '',
          doctype: originalData.doctype || originalData.category || ''
        };
      } catch (err) {
        console.error("Failed to prepare data:", err);
        Swal.fire('Error!', err.message || 'Could not load document.', 'error');
        return;
      }
    }

    const result = await Swal.fire({
      title: 'Apply This Fix?',
      text: "This will merge the selected changes into the live document.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Apply Fix',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        const parsePrice = (val) => {
          if (val === undefined || val === null || val === '') return 0;
          if (typeof val === 'number') return Math.round(val);
          const matched = String(val).match(/\d+/);
          return matched ? parseInt(matched[0]) : 0;
        };

        const parseDuration = (val) => {
          if (val === undefined || val === null || val === '') return 0;
          if (typeof val === 'number') return Math.round(val);
          const matched = String(val).match(/\d+/);
          return matched ? parseInt(matched[0]) : 0;
        };

        const processArrayField = (val, filterUUIDs = false) => {
          if (!val) return [];
          const initialArray = Array.isArray(val) ? val : [String(val)];
          return initialArray.flatMap(item =>
            typeof item === 'string'
              ? item.split(/[\n,;]/).map(s => s.trim()).filter(s => {
                if (!s) return false;
                if (filterUUIDs) return isValidUUID(s);
                return true;
              })
              : (typeof item === 'object' ? [] : item)
          );
        };

        const sanitizedPayload = {
          docname: String(finalData.docname || '').trim(),
          doctype: String(finalData.doctype || finalData.category || '').trim(),
          docprice: parsePrice(finalData.docprice),
          duration: parseDuration(finalData.duration),
          steps: processArrayField(finalData.steps),
          relateddocs: processArrayField(finalData.relateddocs, true)
        };

        if (sanitizedPayload.docname === 'undefined') sanitizedPayload.docname = '';
        if (sanitizedPayload.doctype === 'undefined') sanitizedPayload.doctype = '';

        const pic = finalData.docpicture;
        if (pic && typeof pic === 'string' && (pic.startsWith('http') || pic.startsWith('data:'))) {
          sanitizedPayload.docpicture = pic;
        }

        if (!sanitizedPayload.docname || !sanitizedPayload.doctype || sanitizedPayload.steps.length === 0) {
          const missing = [];
          if (!sanitizedPayload.docname) missing.push('Name');
          if (!sanitizedPayload.doctype) missing.push('Category');
          if (sanitizedPayload.steps.length === 0) missing.push('Steps');
          throw new Error('Missing: ' + missing.join(', '));
        }

        await adminService.validateFix(fixId, sanitizedPayload);
        setFixes(prevFixes => prevFixes.filter(f => (f.fixid || f.id) !== fixId));
        Swal.fire({
          title: 'Applied!',
          text: 'The document has been updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff'
        });
      } catch (error) {
        console.error('Error approving fix:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to apply fix. Please try again.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff'
        });
      }
    }
  };

  const handleReject = async (fixId) => {
    const result = await Swal.fire({
      title: 'Discard Suggested Fix?',
      text: "This will remove the suggestion from the queue.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Discard it',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await adminService.discardFix(fixId);
        setFixes(prevFixes => prevFixes.filter(f => (f.fixid || f.id) !== fixId));
        Swal.fire({
          title: 'Discarded!',
          text: 'The suggestion has been removed.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff'
        });
      } catch (error) {
        console.error('Error rejecting fix:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to discard. Please try again.',
          icon: 'error',
          background: '#1e293b',
          color: '#fff'
        });
      }
    }
  };

  const handleViewDetails = async (fix) => {
    setFetchingDoc(true);
    setSelectedFix(null);
    setOriginalDoc(null);

    try {
      const fixId = fix.fixid || fix.id;
      const fixRes = await proposalService.getProposedFixDetails(fixId);
      const fixData = extractFixData(fixRes);

      if (!fixData) {
        throw new Error('Fix details could not be parsed.');
      }

      if (fixData.stepsDetails) {
        try {
          let parsed = fixData.stepsDetails;
          if (typeof parsed === 'string' && (parsed.startsWith('[') || parsed.startsWith('{'))) {
            parsed = JSON.parse(parsed);
          }
          if (!Array.isArray(parsed)) {
            parsed = [String(parsed)];
          }
          fixData.stepsDetails = parsed;
        } catch (e) {
          fixData.stepsDetails = [String(fixData.stepsDetails)];
        }
      }

      if (fixData.relatedDocsDetails) {
        try {
          let parsedDocs = fixData.relatedDocsDetails;
          if (typeof parsedDocs === 'string' && (parsedDocs.startsWith('[') || parsedDocs.startsWith('{'))) {
            parsedDocs = JSON.parse(parsedDocs);
          }
          if (!Array.isArray(parsedDocs)) parsedDocs = [String(parsedDocs)];

          const resolvedNames = [];
          for (const relatedId of parsedDocs) {
            if (!relatedId || relatedId.length < 5) continue;
            try {
              const rDoc = await documentService.getDocumentById(relatedId);
              if (rDoc && (rDoc.docname || rDoc.data?.docname)) {
                resolvedNames.push(rDoc.docname || rDoc.data.docname);
              } else {
                resolvedNames.push(relatedId);
              }
            } catch (e) {
              resolvedNames.push(relatedId);
            }
          }
          fixData.relatedDocsNames = resolvedNames;
        } catch (e) {
          console.error("Failed to parse related docs:", e);
        }
      }

      setSelectedFix(fixData);

      const fixIdActual = fixData.fixid || fixData.id;
      if (!fixSelections[fixIdActual]) {
        setFixSelections(prev => ({
          ...prev,
          [fixIdActual]: {
            steps: !!fixData.stepsProblem,
            price: !!fixData.priceProblem,
            duration: !!fixData.timeProblem,
            relateddocs: !!fixData.relatedDocsProblem
          }
        }));
      }

      if (fixData && (fixData.docid || fixData.docId)) {
        const docRes = await documentService.getDocumentById(fixData.docid || fixData.docId);
        const docData = docRes.data || docRes;

        if (docRes.relatedDocuments && !docData.relateddocs) {
          docData.relateddocs = docRes.relatedDocuments.map(rd => rd.docname || rd.docid || rd.id);
        } else if (docData.relateddocs && Array.isArray(docData.relateddocs)) {
          const samples = docData.relateddocs;
          if (samples.length > 0 && isValidUUID(samples[0])) {
            const originalNames = [];
            for (const rid of samples) {
              try {
                const r = await documentService.getDocumentById(rid);
                originalNames.push(r.docname || r.data.docname || rid);
              } catch (e) { originalNames.push(rid); }
            }
            docData.relateddocs = originalNames;
          }
        }

        setOriginalDoc(docData);
      }
    } catch (error) {
      console.error('handleViewDetails error:', error);
    } finally {
      setFetchingDoc(false);
    }
  };

  const filteredFixes = fixes
    .filter(f => {
      const docName = f.documents?.docname || '';
      const userName = f.users?.name || '';
      return docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const docA = a.documents?.docname || '';
      const docB = b.documents?.docname || '';
      return docA.localeCompare(docB);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading fixes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, message: '' })}
      />

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/30">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Manage Proposed Fixes</h1>
            </div>
            <p className="text-white/60 ml-14">Review and approve user-submitted document fixes</p>
          </div>

          {/* Search Filter */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-6 border border-white/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search by title or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Fixes Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/60 uppercase tracking-wider">
                      Date
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
                  {filteredFixes.map((fix) => (
                    <tr key={fix.fixid || fix.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white/60" />
                          </div>
                          <span className="text-sm font-medium text-white">{fix.documents?.docname || 'Unknown Document'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white">{fix.users?.name || 'Anonymous'}</div>
                          <div className="text-xs text-white/50">{fix.users?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {fix.creation_date ? new Date(fix.creation_date).toLocaleDateString() : 'N/A'}
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
                            onClick={() => handleViewDetails(fix)}
                            className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 font-medium transition-colors border border-blue-500/30 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleApprove(fix.fixid || fix.id)}
                            className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(fix.fixid || fix.id)}
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

            {filteredFixes.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-white/60">No fixes found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Details Modal */}
          {selectedFix && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 shadow-2xl">
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedFix.title || 'Fix Proposal'}</h2>
                    <p className="text-white/50 mt-1">Comparing proposed changes with live document</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-8">
                  {fetchingDoc ? (
                    <div className="h-full flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-white/50">Loading document comparison...</p>
                    </div>
                  ) : originalDoc ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-full">
                      {renderDocPreview(originalDoc, 'Existing Live Document', 'original')}
                      {renderDocPreview(getModifiedDoc(), 'Proposed Resulting Document', 'modified')}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-white/50">
                      <AlertTriangle className="w-12 h-12 mb-4 text-amber-400" />
                      <p>Original document could not be loaded for comparison.</p>
                      <button onClick={() => fetchFixes()} className="mt-4 text-emerald-400 font-bold hover:underline">Try Refreshing List</button>
                    </div>
                  )}
                </div>

                {/* Context Bar */}
                <div className="px-8 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">User's Feedback</span>
                    <p className="text-sm text-white/60 italic">"{selectedFix.description || 'No explanation provided'}"</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedFix.stepsProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Steps Changed"></span>}
                    {selectedFix.priceProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Price Changed"></span>}
                    {selectedFix.timeProblem && <span className="w-2 h-2 rounded-full bg-amber-400" title="Duration Changed"></span>}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-end items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-6 py-2.5 text-white/70 font-semibold hover:bg-white/10 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedFix.fixid || selectedFix.id);
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-6 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 font-bold rounded-xl transition-colors"
                  >
                    Discard Fix
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedFix.fixid || selectedFix.id, getModifiedDoc());
                      setSelectedFix(null);
                      setOriginalDoc(null);
                    }}
                    className="px-10 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/30 font-bold rounded-xl transition-all"
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
