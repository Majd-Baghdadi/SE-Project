import React, { useState } from 'react';

const ProposeAndFixForm = ({ onSubmit }) => {
  const [type, setType] = useState('propose');
  
  // Propose document fields
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [duration, setDuration] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState('');
  const [steps, setSteps] = useState('');
  const [locationInfo, setLocationInfo] = useState('');
  const [summary, setSummary] = useState('');
  
  // Fix fields
  const [fixTitle, setFixTitle] = useState('');
  const [fixDescription, setFixDescription] = useState('');
  const [fixDetails, setFixDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'propose') {
      onSubmit({ 
        type, 
        docName, 
        category, 
        difficulty, 
        duration, 
        requiredDocuments: requiredDocuments.split('\n').filter(d => d.trim()),
        steps: steps.split('\n').filter(s => s.trim()),
        locationInfo,
        summary
      });
      // Reset propose fields
      setDocName('');
      setCategory('');
      setDifficulty('Easy');
      setDuration('');
      setRequiredDocuments('');
      setSteps('');
      setLocationInfo('');
      setSummary('');
    } else {
      onSubmit({ type, title: fixTitle, description: fixDescription, fixDetails });
      // Reset fix fields
      setFixTitle('');
      setFixDescription('');
      setFixDetails('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ textAlign: 'center' }}>Propose or Fix a Document</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input type="radio" value="propose" checked={type === 'propose'} onChange={() => setType('propose')} /> Propose Document
        </label>
        <label style={{ marginLeft: 16 }}>
          <input type="radio" value="fix" checked={type === 'fix'} onChange={() => setType('fix')} /> Propose Fix
        </label>
      </div>

      {type === 'propose' ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <label>Document Name *<br />
              <input type="text" value={docName} onChange={e => setDocName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </label>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label>Category *<br />
              <select value={category} onChange={e => setCategory(e.target.value)} required style={{ width: '100%', padding: 8 }}>
                <option value="">Select a category</option>
                <option value="Identity">Identity</option>
                <option value="Civil Status">Civil Status</option>
                <option value="Education">Education</option>
                <option value="Transport">Transport</option>
                <option value="Legal">Legal</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Difficulty *<br />
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} required style={{ width: '100%', padding: 8 }}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Duration (e.g., "7-10 days") *<br />
              <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required style={{ width: '100%', padding: 8 }} placeholder="e.g., 7-10 days" />
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Summary *<br />
              <textarea value={summary} onChange={e => setSummary(e.target.value)} required style={{ width: '100%', padding: 8 }} rows={2} placeholder="Brief description of the document" />
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Required Documents (one per line) *<br />
              <textarea value={requiredDocuments} onChange={e => setRequiredDocuments(e.target.value)} required style={{ width: '100%', padding: 8 }} rows={4} placeholder="National ID&#10;Passport photo&#10;Proof of residence" />
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Steps (one per line) *<br />
              <textarea value={steps} onChange={e => setSteps(e.target.value)} required style={{ width: '100%', padding: 8 }} rows={4} placeholder="Collect required documents&#10;Fill the application form&#10;Pay fees" />
            </label>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>Location Info *<br />
              <input type="text" value={locationInfo} onChange={e => setLocationInfo(e.target.value)} required style={{ width: '100%', padding: 8 }} placeholder="e.g., Local office in your wilaya" />
            </label>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <label>Title *<br />
              <input type="text" value={fixTitle} onChange={e => setFixTitle(e.target.value)} required style={{ width: '100%', padding: 8 }} />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Description *<br />
              <textarea value={fixDescription} onChange={e => setFixDescription(e.target.value)} required style={{ width: '100%', padding: 8 }} rows={3} />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Fix Details *<br />
              <textarea value={fixDetails} onChange={e => setFixDetails(e.target.value)} required style={{ width: '100%', padding: 8 }} rows={3} />
            </label>
          </div>
        </>
      )}
      
      <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
};

export default ProposeAndFixForm;
