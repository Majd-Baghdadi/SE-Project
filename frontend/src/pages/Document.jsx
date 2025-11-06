import { useParams } from 'react-router-dom'
import ReportIssueButton from '../components/ReportIssueButton'

const docs = {
  'passport-renewal': {
    title: 'Passport Renewal',
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

  if (!doc) {
    return <div>Document not found.</div>
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h1>{doc.title}</h1>

      <section>
        <h2>Required documents</h2>
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
        <h2>Location info</h2>
        <p>{doc.locationInfo}</p>
      </section>

      <div style={{ marginTop: 16 }}>
        <ReportIssueButton docSlug={slug} />
      </div>
    </div>
  )
}
