'use client';

import { useEffect, useState } from 'react';

type VarianceItem = {
  key: string;
  type: string;
  currency: string;
  amounts_by_source?: Array<{ source: string; amount_cents: number }>;
  missing_sources?: string[];
};

export default function ViewVariancesPage() {
  const [variances, setVariances] = useState<VarianceItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('settlerVariances');
    if (stored) {
      setVariances(JSON.parse(stored) as VarianceItem[]);
    }
  }, []);

  const clearVariances = () => {
    localStorage.removeItem('settlerVariances');
    setVariances([]);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>View Variances</h1>
      <p style={{ marginTop: '1rem', color: '#555' }}>
        Variances are stored locally from the Import Results flow.
      </p>
      <button
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        onClick={clearVariances}
      >
        Clear cached variances
      </button>
      {variances.length === 0 ? (
        <p style={{ marginTop: '1rem' }}>No variances loaded yet.</p>
      ) : (
        <section style={{ marginTop: '2rem' }}>
          <h2>Variance Items</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {variances.map((item, index) => (
              <div
                key={`${item.key}-${index}`}
                style={{ border: '1px solid #ddd', padding: '1rem' }}
              >
                <strong>{item.key}</strong>
                <div>Type: {item.type}</div>
                <div>Currency: {item.currency}</div>
                {item.missing_sources ? (
                  <div>Missing: {item.missing_sources.join(', ')}</div>
                ) : null}
                {item.amounts_by_source ? (
                  <div>
                    Amounts:{' '}
                    {item.amounts_by_source
                      .map((entry) => `${entry.source}: ${entry.amount_cents}`)
                      .join(', ')}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
