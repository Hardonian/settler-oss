'use client';

import { useEffect } from 'react';
import { generateCorrelationId } from '@settler/shared';

export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorId = generateCorrelationId();

  useEffect(() => {
    // Log error for telemetry
    console.error('Console route error', {
      error: error.message,
      digest: error.digest,
      correlationId: errorId,
    });
  }, [error, errorId]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Something went wrong</h2>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        We encountered an error loading the console. This has been logged and we'll investigate.
      </p>
      {errorId && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
          Error ID: {errorId}
        </p>
      )}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
        <a
          href="/"
          style={{
            padding: '0.5rem 1rem',
            background: '#f5f5f5',
            color: '#333',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
