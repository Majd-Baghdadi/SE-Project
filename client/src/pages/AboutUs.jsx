/**
 * About Us Page
 * 
 * Purpose: Information about the platform and how it works
 * 
 * Content:
 * - Platform mission and vision
 * - How community supervision works
 * - How users can contribute
 * - Team information (optional)
 * - Contact information
 * 
 * Components Used:
 * - InfoSection
 * - TeamCard (optional)
 */

import NavBar from '../components/NavBar';

export default function AboutUs() {
  return (
    <>
      <NavBar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>About Procedures Hub</h1>

      {/* Mission Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ lineHeight: '1.8', color: '#555' }}>
          Procedures Hub is a community-driven platform dedicated to simplifying access to 
          governmental procedures in Algeria. We believe that understanding and navigating 
          bureaucratic processes should be straightforward and accessible to everyone.
        </p>
      </section>

      {/* How It Works Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>How It Works</h2>
        <div style={{ 
          display: 'grid', 
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '0.75rem' }}>🔍 Search</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Find the document or procedure you need using our search and filter system.
            </p>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '0.75rem' }}>📋 Follow Steps</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Get detailed, step-by-step instructions on how to obtain your document.
            </p>
          </div>

          <div style={{ 
            padding: '1.5rem', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ marginBottom: '0.75rem' }}>🤝 Contribute</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Help others by reporting outdated information or suggesting new procedures.
            </p>
          </div>
        </div>
      </section>

      {/* Community Supervision Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Community Supervision</h2>
        <p style={{ lineHeight: '1.8', color: '#555', marginBottom: '1rem' }}>
          Our platform thrives on community contributions. Users can:
        </p>
        <ul style={{ 
          lineHeight: '1.8', 
          color: '#555',
          paddingLeft: '2rem'
        }}>
          <li>Propose new documents and procedures</li>
          <li>Report inaccurate or outdated information</li>
          <li>Suggest improvements to existing guides</li>
        </ul>
        <p style={{ lineHeight: '1.8', color: '#555', marginTop: '1rem' }}>
          All contributions are reviewed by our admin team to ensure accuracy and quality 
          before being published.
        </p>
      </section>

      {/* Contact Section */}
      <section style={{ 
        marginTop: '3rem', 
        padding: '2rem',
        background: '#e3f2fd',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Get in Touch</h2>
        <p style={{ color: '#555', marginBottom: '1rem' }}>
          Have questions or suggestions? We'd love to hear from you!
        </p>
        <p style={{ color: '#1976d2', fontWeight: 'bold' }}>
          contact@procedureshub.dz
        </p>
      </section>
    </div>
    </>
  );
}
