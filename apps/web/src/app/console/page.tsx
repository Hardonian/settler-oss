import Link from 'next/link';
import { ConsoleGate } from './console-gate';

export default function ConsolePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/">← Home</Link>
      </nav>

      <ConsoleGate>
        <h1>Settler Console</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
          Managed operations, governance, connectors, audit, and multi-tenant controls
        </p>

        <section style={{ marginTop: '3rem' }}>
          <h2>What is Console?</h2>
          <p>
            Settler Console is a licensed SaaS management layer that provides:
          </p>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Managed operations and hosting</li>
            <li>Enterprise connectors</li>
            <li>Multi-tenant administration</li>
            <li>RBAC and permissions</li>
            <li>Audit logs and compliance</li>
            <li>SSO integration</li>
            <li>Billing and usage tracking</li>
          </ul>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <Link href="/console/login" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', borderRadius: '4px', display: 'inline-block' }}>
            Request Access
          </Link>
        </section>
      </ConsoleGate>
    </main>
  );
}
