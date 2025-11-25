import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function submit(e) {
    e.preventDefault()
    // TODO: call auth API
    console.log('login', { email })
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Sign in</button>
          <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  )
}
