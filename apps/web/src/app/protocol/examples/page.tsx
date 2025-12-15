import Link from 'next/link';

export default function ExamplesPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/protocol">← Protocol</Link>
      </nav>

      <h1>Examples</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Code examples and tutorials for using the Settler Protocol
      </p>

      <section style={{ marginTop: '3rem' }}>
        <h2>Basic Reconciliation</h2>
        <p>Coming soon - example code will be available here.</p>
      </section>
    </main>
  );
}
