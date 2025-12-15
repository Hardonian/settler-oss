import Link from 'next/link';

export default function ProtocolPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/">← Home</Link>
      </nav>

      <h1>Settler Protocol</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Open-source protocol for financial reconciliation. Build with it, self-host it, integrate it.
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>What is the Protocol?</h2>
        <p>
          The Settler Protocol is an open-source API specification and set of SDKs 
          that enable financial reconciliation, transaction matching, and data synchronization. 
          It's MIT licensed and can be freely used, modified, and self-hosted.
        </p>

        <h3 style={{ marginTop: '2rem' }}>Protocol Guarantees</h3>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
          <li>Open specification - fully documented API contracts</li>
          <li>Self-hostable - run your own protocol instance</li>
          <li>Versioned - stable API with semantic versioning</li>
          <li>Language agnostic - SDKs for TypeScript, Python, Go, Ruby</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Quick Start</h2>
        <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
          <pre style={{ overflow: 'auto' }}>
{`npm install @settler/sdk

import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
});

const result = await client.reconcile({
  source: [...],
  target: [...],
});`}
          </pre>
        </div>
        <Link href="/protocol/sdk" style={{ display: 'inline-block', marginTop: '1rem', color: '#0070f3' }}>
          View full SDK documentation →
        </Link>
      </section>

      <nav style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/protocol/sdk">SDK Docs</Link>
        <Link href="/protocol/spec">API Spec</Link>
        <Link href="/protocol/examples">Examples</Link>
      </nav>
    </main>
  );
}
