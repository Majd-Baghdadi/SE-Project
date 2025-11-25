import { useState } from 'react'

export default function Profile() {
  // In a real app this would come from an API / auth context
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Ahmed Salah')
  const [wilaya, setWilaya] = useState('Algiers')

  function save(e) {
    e.preventDefault()
    // TODO: save via API
    setEditing(false)
    alert('Profile saved (dummy)')
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>My profile</h1>
      {!editing ? (
        <div>
          <div><strong>Name:</strong> {name}</div>
          <div><strong>Wilaya:</strong> {wilaya}</div>
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setEditing(true)}>Edit profile</button>
          </div>
        </div>
      ) : (
        <form onSubmit={save} style={{ display: 'grid', gap: 8 }}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Wilaya
            <input value={wilaya} onChange={(e) => setWilaya(e.target.value)} />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
