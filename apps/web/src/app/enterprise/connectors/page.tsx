import Link from 'next/link';

export default function ConnectorsPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/enterprise">← Enterprise</Link>
      </nav>

      <h1>Enterprise Connectors</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Connect to enterprise systems and services
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Public Connectors (OSS Protocol)</h2>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          These connectors are part of the open-source protocol and can be self-hosted.
        </p>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
          <li>REST API connector</li>
          <li>CSV file connector</li>
          <li>JSON file connector</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Enterprise Connectors (Licensed)</h2>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          These connectors require an enterprise license and are available in the managed console.
        </p>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
          <li>SAP ERP connector</li>
          <li>Salesforce connector</li>
          <li>Oracle Financials connector</li>
          <li>Microsoft Dynamics connector</li>
          <li>Custom enterprise integrations</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <p>
          <strong>Note:</strong> Enterprise connectors are part of the licensed SaaS management layer. 
          The open-source protocol remains stable while enterprise connectors expand.
        </p>
      </section>
    </main>
  );
}
