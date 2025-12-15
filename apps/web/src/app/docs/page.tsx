import Link from 'next/link';

export default function DocsPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/">← Home</Link>
      </nav>

      <h1>Documentation</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Public documentation for Settler Protocol and Console
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Protocol Documentation (OSS)</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
          <li><Link href="/protocol">Protocol Overview</Link></li>
          <li><Link href="/protocol/sdk">SDK Documentation</Link></li>
          <li><Link href="/protocol/spec">API Specification</Link></li>
          <li><Link href="/protocol/examples">Examples & Tutorials</Link></li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem' }}>
        <h2>Console Documentation (Licensed SaaS)</h2>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Console documentation is available to licensed users. 
          <Link href="/console" style={{ marginLeft: '0.5rem', color: '#0070f3' }}>
            Access Console →
          </Link>
        </p>
      </section>
    </main>
  );
}
