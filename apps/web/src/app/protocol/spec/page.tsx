import Link from 'next/link';

export default function SpecPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/protocol">← Protocol</Link>
      </nav>

      <h1>API Specification</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Complete API reference for the Settler Protocol
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Protocol Version</h2>
        <p>Current version: <strong>1.0.0</strong></p>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Endpoints</h2>
        <div style={{ marginTop: '1rem' }}>
          <h3>POST /v1/reconcile</h3>
          <p>Reconcile transactions between source and target datasets.</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h3>POST /v1/sync</h3>
          <p>Synchronize data between sources.</p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h3>GET /v1/health</h3>
          <p>Health check endpoint.</p>
        </div>
      </section>
    </main>
  );
}
