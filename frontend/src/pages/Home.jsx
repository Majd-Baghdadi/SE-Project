import SearchBar from '../components/SearchBar'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [results, setResults] = useState([])

  function handleSearch(q) {
    // Placeholder search: in a real app this would query the backend.
    const items = q
      ? [
          { title: 'Passport Renewal', slug: 'passport-renewal', excerpt: 'Renew your passport — required docs & steps.' },
        ]
      : []
    setResults(items)
  }

  return (
    <div>
      <h1>Welcome to SE-Project</h1>
      <p>Find public procedure guides and contribute by reporting issues or editing.</p>
      <SearchBar onSearch={handleSearch} />

      <section style={{ marginTop: 20 }}>
        <h2>Search results</h2>
        {results.length === 0 ? (
          <p>No results yet — try searching for "passport".</p>
        ) : (
          <ul>
            {results.map((r) => (
              <li key={r.slug} style={{ marginBottom: 12 }}>
                <Link to={`/document/${r.slug}`} style={{ fontWeight: 700 }}>{r.title}</Link>
                <div>{r.excerpt}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
