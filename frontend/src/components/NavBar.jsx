import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: '0.75rem 1rem', alignItems: 'center', background: 'var(--nav-bg, #111)' }}>
      <Link to="/" style={{ fontWeight: 700, color: 'inherit' }}>SE-Project</Link>
      <div style={{ flex: 1 }} />
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  )
}
