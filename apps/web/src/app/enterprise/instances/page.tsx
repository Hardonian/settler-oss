import Link from 'next/link';

export default function InstancesPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/enterprise">← Enterprise</Link>
      </nav>

      <h1>Dedicated Instances</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Enterprise-grade deployment options for your organization
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Deployment Options</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Dedicated Cloud Instance</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Isolated instance in your preferred cloud region with dedicated resources.
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Data Residency</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Deploy in specific regions to meet data residency requirements (EU, US, APAC, etc.).
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>VPC / Private Networking</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Connect via private networking to your existing infrastructure.
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>BYO-Key / KMS Integration</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Bring your own encryption keys and integrate with your KMS.
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Audit Export / SIEM Forwarding</h3>
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            Export audit logs and forward to your SIEM system.
          </p>
        </div>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <a 
          href="mailto:sales@settler.dev" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#0070f3', 
            color: 'white', 
            borderRadius: '4px', 
            display: 'inline-block',
            fontWeight: '500'
          }}
        >
          Contact Sales for Instance Setup
        </a>
      </section>
    </main>
  );
}
