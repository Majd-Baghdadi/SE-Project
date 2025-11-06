import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')

  function submit(e) {
    e.preventDefault()
    onSearch?.(q)
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        aria-label="Search procedures"
        placeholder="Search procedures, e.g. passport renewal..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #ccc', minWidth: 320 }}
      />
      <button type="submit">Search</button>
    </form>
  )
}
