import Link from 'next/link';

export default function SdkPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/protocol">← Protocol</Link>
      </nav>

      <h1>SDK Documentation</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Official SDKs for the Settler Protocol
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Available SDKs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>TypeScript/Node.js</h3>
            <code style={{ display: 'block', marginTop: '0.5rem' }}>npm install @settler/sdk</code>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>Python</h3>
            <code style={{ display: 'block', marginTop: '0.5rem' }}>pip install settler-sdk</code>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>Go</h3>
            <code style={{ display: 'block', marginTop: '0.5rem' }}>go get github.com/shardie-github/settler-oss/packages/sdk-go</code>
          </div>
          <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>Ruby</h3>
            <code style={{ display: 'block', marginTop: '0.5rem' }}>gem install settler-sdk</code>
          </div>
        </div>
      </section>
    </main>
  );
}
