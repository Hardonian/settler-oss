export default function ConsoleHome() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Settler Console</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
        Licensed SaaS Management Layer
      </p>
      <p style={{ marginTop: '1rem' }}>
        This is the console application. In production, this would include:
      </p>
      <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
        <li>Dashboard</li>
        <li>Tenant management</li>
        <li>RBAC and permissions</li>
        <li>Audit logs</li>
        <li>Billing</li>
        <li>SSO configuration</li>
        <li>Enterprise connectors</li>
      </ul>
    </main>
  );
}
