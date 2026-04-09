'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    // Here we will eventually log to Sentry
  }, [error]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bone)', color: 'var(--charcoal)' }}>
      <h2>Something went wrong!</h2>
      <p style={{ marginBottom: '1rem', opacity: 0.7 }}>A component failed to render. We have been notified.</p>
      <button
        onClick={() => reset()}
        style={{ padding: '0.8rem 1.5rem', backgroundColor: 'var(--terracotta)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}
