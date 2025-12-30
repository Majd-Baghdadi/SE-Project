import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(email, password)

      if (response.success) {
        navigate('/')
      } else {
        setError(response.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Login error:', err);
      // Check if error is related to unverified email (assuming backend sends 403 or specific message)
      if (err.response?.status === 403 || err.error?.includes('verify') || err.message?.includes('verify')) {
        setError('Your email is not verified. Please verify your email to continue.');
        // We'll use a specific state to show the verify button
        setNeedsVerification(true);
      } else {
        setError(err.error || err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Login</h1>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33'
        }}>
          {error}
          {needsVerification && (
            <div style={{ marginTop: '8px' }}>
              <button
                onClick={() => navigate('/verify-email')}
                style={{
                  backgroundColor: '#c33',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Go to Verify Email Page
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            disabled={loading}
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            disabled={loading}
          />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <Link to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  )
}
