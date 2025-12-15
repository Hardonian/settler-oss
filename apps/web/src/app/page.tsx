import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Settler</h1>
      <p>Financial Reconciliation Protocol</p>
      
      <nav style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/protocol">Protocol</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/console">Console</Link>
        <Link href="/enterprise">Enterprise</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>

      <section style={{ marginTop: '3rem' }}>
        <h2>Open-Source Protocol</h2>
        <p>
          Settler provides powerful APIs and SDKs for financial reconciliation, 
          transaction matching, and data synchronization. Build with it, self-host it, 
          and integrate it into your applications.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Link href="/protocol" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', borderRadius: '4px' }}>
            Read the Spec
          </Link>
          <Link href="/protocol/sdk" style={{ padding: '0.5rem 1rem', background: '#333', color: 'white', borderRadius: '4px' }}>
            Install SDK
          </Link>
        </div>
      </section>
    </main>
  );
}
