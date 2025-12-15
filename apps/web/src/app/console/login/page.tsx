import Link from 'next/link';

export default function LoginPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/console">← Console</Link>
      </nav>

      <h1>Console Login</h1>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        Access to Settler Console requires a license. Request access or start a trial.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <p>
          <a href="mailto:sales@settler.dev" style={{ color: '#0070f3' }}>
            Contact Sales →
          </a>
        </p>
        <p style={{ marginTop: '1rem' }}>
          <a href="/enterprise" style={{ color: '#0070f3' }}>
            Learn about Enterprise Plans →
          </a>
        </p>
      </section>
    </main>
  );
}
