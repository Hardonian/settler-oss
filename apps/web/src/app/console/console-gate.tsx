'use client';

import { useState, useEffect, ReactNode } from 'react';
import { generateCorrelationId, formatError } from '@settler/shared';

interface ConsoleGateProps {
  children: ReactNode;
}

export function ConsoleGate({ children }: ConsoleGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    // In a real implementation, this would call your auth API
    const checkAuth = async () => {
      try {
        // Simulate auth check - replace with actual API call
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {
          // Backend unreachable - show graceful fallback
          throw new Error('CONSOLE_UNAVAILABLE');
        });

        if (!response.ok) {
          throw new Error('NOT_AUTHENTICATED');
        }

        setIsAuthenticated(true);
      } catch (err) {
        const correlationId = generateCorrelationId();
        setErrorId(correlationId);
        
        if (err instanceof Error && err.message === 'CONSOLE_UNAVAILABLE') {
          setError('CONSOLE_UNAVAILABLE');
        } else {
          setError('NOT_AUTHENTICATED');
        }
        
        setIsAuthenticated(false);
        
        // Log error for telemetry
        console.error('Console auth check failed', {
          error: formatError(err),
          correlationId,
        });
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Backend unreachable - graceful degradation
  if (error === 'CONSOLE_UNAVAILABLE') {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Console Temporarily Unavailable</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          We're experiencing connectivity issues with the console service. 
          Please try again in a few moments.
        </p>
        {errorId && (
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999' }}>
            Error ID: {errorId}
          </p>
        )}
        <div style={{ marginTop: '2rem' }}>
          <a href="/protocol" style={{ color: '#0070f3' }}>
            View Protocol Documentation →
          </a>
        </div>
      </div>
    );
  }

  // Not authenticated - show marketing/login CTA
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Settler Console</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: '#666' }}>
          Managed operations, governance, connectors, audit, and multi-tenant controls
        </p>

        <section style={{ marginTop: '3rem' }}>
          <h2>What is Console?</h2>
          <p>
            Settler Console is a licensed SaaS management layer that provides:
          </p>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Managed operations and hosting</li>
            <li>Enterprise connectors</li>
            <li>Multi-tenant administration</li>
            <li>RBAC and permissions</li>
            <li>Audit logs and compliance</li>
            <li>SSO integration</li>
            <li>Billing and usage tracking</li>
          </ul>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <a 
            href="/console/login" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: '#0070f3', 
              color: 'white', 
              borderRadius: '4px', 
              display: 'inline-block',
              fontWeight: '500'
            }}
          >
            Request Access or Start Trial
          </a>
        </section>

        <section style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Prefer Self-Hosting?</h3>
          <p style={{ marginTop: '0.5rem' }}>
            The Settler Protocol is open-source and can be self-hosted. 
            <a href="/protocol" style={{ marginLeft: '0.5rem', color: '#0070f3' }}>
              Learn more about self-hosting →
            </a>
          </p>
        </section>
      </div>
    );
  }

  // Authenticated - show console content
  return <>{children}</>;
}
