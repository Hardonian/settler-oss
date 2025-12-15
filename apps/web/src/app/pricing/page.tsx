import Link from 'next/link';

export default function PricingPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/">← Home</Link>
      </nav>

      <h1>Pricing</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Clear separation: Protocol is free, Console and Enterprise are paid
      </p>

      <section style={{ marginTop: '3rem' }}>
        <div style={{ border: '2px solid #0070f3', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2>Protocol (OSS) - Free</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>$0</p>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Open-source SDKs (TypeScript, Python, Go, Ruby)</li>
            <li>API specification</li>
            <li>Self-hostable</li>
            <li>MIT licensed</li>
            <li>Community support</li>
          </ul>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/protocol" style={{ color: '#0070f3', fontWeight: '500' }}>
              Get Started with Protocol →
            </Link>
          </div>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2>Console (Licensed SaaS) - Paid</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Starting at $99/month</p>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Managed hosting</li>
            <li>Multi-tenant administration</li>
            <li>RBAC and permissions</li>
            <li>Audit logs</li>
            <li>SSO integration</li>
            <li>Email support</li>
          </ul>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/console" style={{ color: '#0070f3', fontWeight: '500' }}>
              Start Console Trial →
            </Link>
          </div>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px' }}>
          <h2>Enterprise - Custom</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Contact Sales</p>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Enterprise connectors</li>
            <li>Dedicated instances</li>
            <li>Data residency</li>
            <li>VPC / private networking</li>
            <li>BYO-key / KMS</li>
            <li>Custom SLAs</li>
            <li>Priority support</li>
          </ul>
          <div style={{ marginTop: '1.5rem' }}>
            <a href="mailto:sales@settler.dev" style={{ color: '#0070f3', fontWeight: '500' }}>
              Contact Sales →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
