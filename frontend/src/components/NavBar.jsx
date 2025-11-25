import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav style={{ 
      display: 'flex', 
      gap: '1.5rem', 
      padding: '1rem 2rem', 
      alignItems: 'center', 
      background: 'var(--nav-bg, #1a1a2e)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <Link 
        to="/" 
        style={{ 
          fontWeight: 700, 
          fontSize: '1.25rem',
          color: 'inherit',
          textDecoration: 'none'
        }}
      >
        Procedures Hub
      </Link>
      
      <div style={{ flex: 1 }} />
      
      {/* Sprint 1 Navigation */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        Home
      </Link>
      <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
        About Us
      </Link>
      
      {/* Future Sprint Navigation (commented out) */}
      {/* <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
        Profile
      </Link>
      <Link to="/propose" style={{ textDecoration: 'none', color: 'inherit' }}>
        Propose Document
      </Link> */}
    </nav>
  )
}
