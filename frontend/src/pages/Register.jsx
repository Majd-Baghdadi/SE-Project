import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault()
    // TODO: call register API
    console.log('register', { email, name })
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1>Sign up</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Create account</button>
        </div>
      </form>
    </div>
  )
}
