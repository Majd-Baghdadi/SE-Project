import { useParams } from 'react-router-dom'
import { useState } from 'react'
import ReportIssueButton from '../components/ReportIssueButton'

const docs = {
  'passport-renewal': {
    title: 'Passport Renewal',
    summary: 'Quick guide to renew your passport — required docs, steps and where to go.',
    requiredDocuments: [
      'Old passport (original)',
      'National ID',
      'Two passport photos',
      'Proof of residence',
    ],
    steps: [
      'Collect required documents',
      'Fill the application form at the municipality',
      'Pay fees and wait for processing',
    ],
    locationInfo: 'Local passport office in your wilaya. Opening hours: 08:00-15:00'
  }
}

export default function DocumentPage() {
  const { slug } = useParams()
  const doc = docs[slug] || null
  const [expanded, setExpanded] = useState(false)

  if (!doc) {
    return <div>Document not found.</div>
  }

  // Simple mockup card + expandable full details
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 12 }}>
      <h1 style={{ marginBottom: 8 }}>{doc.title}</h1>
      <p style={{ marginTop: 0, color: '#444' }}>{doc.summary}</p>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginTop: 16 }}>
        {/* Mockup visual card */}
        <div style={{ width: 360, border: '1px solid #e0e0e0', borderRadius: 10, padding: 14, background: '#fff', boxShadow: '0 6px 18px rgba(20,20,20,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, background: '#f3f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{doc.title.split(' ')[0][0]}</div>
            <div>
              <div style={{ fontWeight: 700 }}>{doc.title}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Official procedure · {doc.locationInfo.split('.')[0]}</div>
            </div>
          </div>

          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid #f0f0f0' }} />

          <div>
            <strong>Required docs</strong>
            <ul style={{ paddingLeft: 18 }}>
              {doc.requiredDocuments.slice(0, 3).map((d) => <li key={d} style={{ marginTop: 6 }}>{d}</li>)}
              {doc.requiredDocuments.length > 3 && <li style={{ marginTop: 6, color: '#888' }}>+{doc.requiredDocuments.length - 3} more</li>}
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setExpanded((s) => !s)} style={{ padding: '8px 12px' }}>{expanded ? 'Hide details' : 'View more'}</button>
            <ReportIssueButton docSlug={slug} />
          </div>
        </div>

        {/* Details area that expands when user clicks View more */}
        <div style={{ flex: 1, minWidth: 320 }}>
          {!expanded ? (
            <div style={{ padding: 12, borderRadius: 8, background: '#fcfcfd', border: '1px dashed #eee' }}>
              <p style={{ margin: 0 }}>Click "View more" to see full steps, documents and location information for this procedure.</p>
            </div>
          ) : (
            <div style={{ padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #eef2ff' }}>
              <section>
                <h2 style={{ marginTop: 0 }}>Required documents</h2>
                <ul>
                  {doc.requiredDocuments.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </section>

              <section>
                <h2>Steps</h2>
                <ol>
                  {doc.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
              </section>

              <section>
                <h2>Location</h2>
                <p>{doc.locationInfo}</p>
              </section>

              <div style={{ marginTop: 14 }}>
                <ReportIssueButton docSlug={slug} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
