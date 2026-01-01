import { useState, useEffect } from 'react';
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
  const [fixSelections, setFixSelections] = useState({}); // { [fixId]: { steps: bool, price: bool, duration: bool, relateddocs: bool } }

  const getModifiedDoc = () => {
    if (!originalDoc || !selectedFix) return null;
    const selections = fixSelections[selectedFix.fixid || selectedFix.id] || {};

    // Use resolved names if available for display, otherwise fall back to raw details
    // Note: selectedFix.stepsDetails is now already parsed as an array by handleViewDetails
    const stepsToUse = (selectedFix.stepsProblem && selections.steps)
      ? (selectedFix.stepsDetails ? selectedFix.stepsDetails : originalDoc.steps)
      : originalDoc.steps;

    const docsToUse = (selectedFix.relatedDocsProblem && selections.relateddocs)
      ? (selectedFix.relatedDocsNames ? selectedFix.relatedDocsNames : (selectedFix.relatedDocsDetails ? [selectedFix.relatedDocsDetails] : originalDoc.relateddocs))
      : originalDoc.relateddocs;

    return {
      ...originalDoc,
      steps: stepsToUse,
      docprice: (selectedFix.priceProblem && selections.price) ? selectedFix.priceDetails : originalDoc.docprice,
      duration: (selectedFix.timeProblem && selections.duration) ? selectedFix.timeDetails : originalDoc.duration,
      relateddocs: docsToUse
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
      return problems[field] ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-400 ring-opacity-30' : '';
    };

    const toggleSelection = (e, field) => {
      e.stopPropagation();
      const fixId = selectedFix.fixid || selectedFix.id;
      setFixSelections(prev => ({
        ...prev,
        [fixId]: {
          ... (prev[fixId] || {}),
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
        relateddocs: 'relatedDocsProblem'
      };
      return !!selectedFix[mapped[field]];
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
            <div
              className={`p-3 rounded-xl border bg-white transition-all ${highlight('docprice')} ${isSelectable('docprice') ? 'cursor-pointer hover:border-amber-300' : ''}`}
              onClick={(e) => isSelectable('docprice') && toggleSelection(e, 'price')}
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Price</p>
                {isSelectable('docprice') && (
                  <input
                    type="checkbox"
                    checked={fixSelections[selectedFix.fixid || selectedFix.id]?.price}
                    onChange={() => { }} // Handled by div onClick
                    className="w-3 h-3 text-amber-500 rounded focus:ring-amber-400"
                  />
                )}
              </div>
              <p className="text-sm font-bold text-gray-900">{doc.docprice || '0'} DA</p>
            </div>
            <div
              className={`p-3 rounded-xl border bg-white transition-all ${highlight('duration')} ${isSelectable('duration') ? 'cursor-pointer hover:border-amber-300' : ''}`}
              onClick={(e) => isSelectable('duration') && toggleSelection(e, 'duration')}
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Duration</p>
                {isSelectable('duration') && (
                  <input
                    type="checkbox"
                    checked={fixSelections[selectedFix.fixid || selectedFix.id]?.duration}
                    onChange={() => { }}
                    className="w-3 h-3 text-amber-500 rounded focus:ring-amber-400"
                  />
                )}
              </div>
              <p className="text-sm font-bold text-gray-900">{doc.duration || 'N/A'}</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border bg-white transition-all ${highlight('steps')} ${isSelectable('steps') ? 'cursor-pointer hover:border-amber-300' : ''}`}
            onClick={(e) => isSelectable('steps') && toggleSelection(e, 'steps')}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                Procedure Steps
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {Array.isArray(doc.steps) ? doc.steps.length : '1'} Steps
                </span>
              </p>
              {isSelectable('steps') && (
                <input
                  type="checkbox"
                  checked={fixSelections[selectedFix.fixid || selectedFix.id]?.steps}
                  onChange={() => { }}
                  className="w-3 h-3 text-amber-500 rounded focus:ring-amber-400"
                />
              )}
            </div>
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

          <div
            className={`p-4 rounded-xl border bg-white transition-all ${highlight('relateddocs')} ${isSelectable('relateddocs') ? 'cursor-pointer hover:border-amber-300' : ''}`}
            onClick={(e) => isSelectable('relateddocs') && toggleSelection(e, 'relateddocs')}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Required Documents</p>
              {isSelectable('relateddocs') && (
                <input
                  type="checkbox"
                  checked={fixSelections[selectedFix.fixid || selectedFix.id]?.relateddocs}
                  onChange={() => { }}
                  className="w-3 h-3 text-amber-500 rounded focus:ring-amber-400"
                />
              )}
            </div>
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
  // Helper to validate UUID format
  const isValidUUID = (uuid) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  };

  // Helper to find the real fix object regardless of server wrapping
  const extractFixData = (res) => {
    if (!res) return null;
    // Common patterns: res.fix, res.data.fix, res.data[0], or res itself
    let current = res.fix || (res.data && res.data.fix ? res.data.fix : res.data) || res;
    if (Array.isArray(current)) current = current[0];
    if (current && current.data && !current.docid) current = current.data; // Handle double data wrapping
    if (Array.isArray(current)) current = current[0];
    return current;
  };

  const handleApprove = async (fixId, providedData = null) => {
    let finalData = providedData;

    // If no data provided (e.g. from table), we need to compute it from original doc and selections
    if (!finalData) {
      try {
        // Step 1: Fetch full fix details to ensure we have docid
        const fixRes = await proposalService.getProposedFixDetails(fixId);
        const fix = extractFixData(fixRes);

        if (!fix) {
          throw new Error('Fix details could not be found in the server response.');
        }

        // Check for userid to prevent server-side crash in addContribution
        if (!fix.userid && !fix.userId) {
          console.warn('⚠️ Fix is missing a userid. Reward points will fail on server.');
        }

        // Deep discovery: Look everywhere for the document ID
        const rawDocId = fix.docid || fix.docId || (fix.documents && (fix.documents.docid || fix.documents.id));

        if (!rawDocId || !isValidUUID(rawDocId)) {
          console.error('❌ Invalid DocID found:', rawDocId);
          throw new Error('This fix is missing a valid link to a document. It cannot be applied.');
        }

        const actualDocId = rawDocId;

        // Step 2: Fetch original doc
        const docRes = await documentService.getDocumentById(actualDocId);
        const originalData = docRes.data || docRes;

        if (!originalData || !originalData.docname) {
          throw new Error('The original document could not be loaded.');
        }

        // Use selections if they exist, otherwise default to all problems found in the fix
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
          // Re-map mandatory fields to ensure they exist for the controller's validation
          docname: originalData.docname || fix.documentName || '',
          doctype: originalData.doctype || originalData.category || ''
        };
      } catch (err) {
        console.error("Failed to prepare data for approval:", err);
        Swal.fire('Error!', err.message || 'Could not load document to apply fixes.', 'error');
        return;
      }
    }

    const result = await Swal.fire({
      title: 'Apply This Fix?',
      text: "This will merge the selected changes into the live document.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Apply Fix'
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

        // Deeply sanitized payload - NO extra fields
        const sanitizedPayload = {
          docname: String(finalData.docname || '').trim(),
          doctype: String(finalData.doctype || finalData.category || '').trim(),
          docprice: parsePrice(finalData.docprice),
          duration: parseDuration(finalData.duration),
          steps: processArrayField(finalData.steps),
          relateddocs: processArrayField(finalData.relateddocs, true) // ONLY send valid UUIDs
        };

        // Final check: ensure we didn't end up with 'undefined' as a string
        if (sanitizedPayload.docname === 'undefined') sanitizedPayload.docname = '';
        if (sanitizedPayload.doctype === 'undefined') sanitizedPayload.doctype = '';

        // Valid image check
        const pic = finalData.docpicture;
        if (pic && typeof pic === 'string' && (pic.startsWith('http') || pic.startsWith('data:'))) {
          sanitizedPayload.docpicture = pic;
        }

        console.log('🚀 Final validation check for:', sanitizedPayload.docname);

        if (!sanitizedPayload.docname || !sanitizedPayload.doctype || sanitizedPayload.steps.length === 0) {
          const missing = [];
          if (!sanitizedPayload.docname) missing.push('Name');
          if (!sanitizedPayload.doctype) missing.push('Category');
          if (sanitizedPayload.steps.length === 0) missing.push('Steps');
          throw new Error('Mandatory fields missing: ' + missing.join(', '));
        }

        await adminService.validateFix(fixId, sanitizedPayload);
        setFixes(prevFixes => prevFixes.filter(f => (f.fixid || f.id) !== fixId));
        Swal.fire({
          title: 'Applied!',
          text: 'The document has been updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error approving fix:', error);
        Swal.fire('Error!', 'Failed to apply fix. Please try again.', 'error');
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
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Discard it'
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
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error rejecting fix:', error);
        Swal.fire('Error!', 'Failed to discard. Please try again.', 'error');
      }
    }
  };

  const handleViewDetails = async (fix) => {
    console.log("🧪 [CLICK] Fix object:", fix);
    console.log("🧪 [CLICK] Document ID from fix:", fix.docid || fix.docId);


    setFetchingDoc(true);
    setSelectedFix(null);
    setOriginalDoc(null);

    try {
      const fixId = fix.fixid || fix.id;
      console.log('🟡 Fetching fix details for ID:', fixId);

      const fixRes = await proposalService.getProposedFixDetails(fixId);
      console.log('🟢 Fix details response:', fixRes);

      const fixData = extractFixData(fixRes);

      if (!fixData) {
        console.error('🔴 Fix details fetch failed. Structure:', fixRes);
        throw new Error('Fix details could not be parsed from server response.');
      }

      if (!fixData.userid && !fixData.userId) {
        Swal.fire({
          title: 'Warning',
          text: 'This fix proposal has no associated User ID. Approving it might fail on the server.',
          icon: 'warning',
          confirmButtonColor: '#d33'
        });
      }

      // -----------------------------------------------------
      // FIX 1 & 2: Parse Steps & Handle Empty First Step
      // -----------------------------------------------------
      if (fixData.stepsDetails) {
        try {
          let parsed = fixData.stepsDetails;
          // If it's a JSON string, parse it
          if (typeof parsed === 'string' && (parsed.startsWith('[') || parsed.startsWith('{'))) {
            parsed = JSON.parse(parsed);
          }

          // Ensure it's an array
          if (!Array.isArray(parsed)) {
            // If it's a simple string (legacy), wrap in array
            parsed = [String(parsed)];
          }

          // Filter out empty strings if desired, OR keep them if index matters.
          // User asked: "leaves the first step blank and the second step fills it , it is received as an empty first stepp and a normal 2nd step"
          // This implies the user wants to *see* that index 0 is empty.
          // However, typically we want to CLEAN UP for the final doc.
          // But if the user INTENTIONALLY sent an empty step to say "delete this", we should handle logic.
          // The current prompt says: "ensure ... it is received as an empty first stepp"
          // So we should respect the array as sent.
          fixData.stepsDetails = parsed;

        } catch (e) {
          console.error("Failed to parse stepsDetails:", e);
          // If parse fails, treat as single text line
          fixData.stepsDetails = [String(fixData.stepsDetails)];
        }
      }

      // -----------------------------------------------------
      // FIX 3: Resolve Related Doc Names
      // -----------------------------------------------------
      if (fixData.relatedDocsDetails) {
        try {
          let parsedDocs = fixData.relatedDocsDetails;
          if (typeof parsedDocs === 'string' && (parsedDocs.startsWith('[') || parsedDocs.startsWith('{'))) {
            parsedDocs = JSON.parse(parsedDocs);
          }
          if (!Array.isArray(parsedDocs)) parsedDocs = [String(parsedDocs)];

          // Now these are UUIDs. We need to fetch their names to display them nicely.
          // We can't easily fetch names one by one efficiently here without a "getDocumentsByIds" endpoint,
          // but we can fetch ALL docs (since we likely have them cached or it's fast) or just display ID for now 
          // and let the render function handle name lookup if we had a map.
          // BETTER APPROACH: Fetch the names right here.
          const resolvedNames = [];
          for (const relatedId of parsedDocs) {
            // Skip empty or invalid
            if (!relatedId || relatedId.length < 5) continue;
            try {
              // Try to find it in our known 'fixes' list? No.
              // Fetch individual doc name?
              const rDoc = await documentService.getDocumentById(relatedId);
              if (rDoc && (rDoc.docname || rDoc.data?.docname)) {
                resolvedNames.push(rDoc.docname || rDoc.data.docname);
              } else {
                resolvedNames.push(relatedId); // Fallback to ID
              }
            } catch (e) {
              resolvedNames.push(relatedId);
            }
          }
          // Use the RESOLVED names for display in the "Modified" view
          // CAUTION: The 'value' we pass to the final approval must be IDs, but for *preview* we want names.
          // We'll store a separate 'relatedDocsDisplay' property or just overwrite if we don't need IDs after this.
          // Wait, 'getModifiedDoc' merges this into 'relateddocs'. 
          // If we overwrite with names, the final 'Apply' logic needs to map names back to IDs? 
          // 'Apply Fix' uses 'finalData' which comes from 'getModifiedDoc'.
          // 'sanitizedPayload.relateddocs' expects valid UUIDs (filterUUIDs=true). 
          // So if we convert to names here, Apply will FAIL to validate UUIDs.

          // SOLUTION: Keep actual IDs in 'fixData.relatedDocsDetails' but add 'fixData.relatedDocsNames' for display.
          fixData.relatedDocsNames = resolvedNames;

        } catch (e) {
          console.error("Failed to parse/resolve related docs:", e);
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
        console.log('🟡 Fetching original document, docid:', fixData.docid || fixData.docId);

        const docRes = await documentService.getDocumentById(fixData.docid || fixData.docId);
        const docData = docRes.data || docRes;

        // Merge relateddocs IDs back into the docData if they are in sibling relatedDocuments
        // And convert original doc IDs to names too? The original doc usually has 'relateddocs' as array of strings (names or IDs?)
        // In 'ManageProposedFixes', line 174: it just maps 'doc.relateddocs'. 
        // If the backend sends names, great. If IDs, we have same issue.
        // Let's assume original doc has names properly populated or we might need to resolve them too.
        if (docRes.relatedDocuments && !docData.relateddocs) {
          // If relatedDocuments contains objects with 'docname', map to names!
          docData.relateddocs = docRes.relatedDocuments.map(rd => rd.docname || rd.docid || rd.id);
        } else if (docData.relateddocs && Array.isArray(docData.relateddocs)) {
          // Check if they look like IDs
          const samples = docData.relateddocs;
          if (samples.length > 0 && isValidUUID(samples[0])) {
            // Resolve original doc IDs to names too
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
      } else {
        console.warn('⚠️ Fix has no docid');
      }
    } catch (error) {
      console.error('❌ handleViewDetails error:', error);
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
          <div className="mb-8 overflow-hidden">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">Manage Proposed Fixes</h1>
            <p className="text-sm md:text-base text-gray-600">Review and approve user-submitted document fixes</p>
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
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
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
                  <tr key={fix.fixid || fix.id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {fix.documents?.docname || 'Unknown Document'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium text-gray-900">{fix.users?.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{fix.users?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fix.creation_date ? new Date(fix.creation_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Pending
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(fix)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors border border-blue-200"
                        >
                          👁️ View
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApprove(fix.fixid || fix.id)}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium transition-colors border border-green-200"
                            title="Approve"
                          >
                            ✅
                          </button>
                          <button
                            onClick={() => handleReject(fix.fixid || fix.id)}
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
                      handleApprove(selectedFix.fixid || selectedFix.id, getModifiedDoc());
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
