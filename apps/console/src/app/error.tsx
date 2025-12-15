'use client';

import { useEffect } from 'react';
import { generateCorrelationId } from '@settler/shared';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorId = generateCorrelationId();

  useEffect(() => {
    console.error('Console error', {
      error: error.message,
      digest: error.digest,
      correlationId: errorId,
    });
  }, [error, errorId]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        We encountered an error. This has been logged.
      </p>
      {errorId && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
          Error ID: {errorId}
        </p>
      )}
      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
