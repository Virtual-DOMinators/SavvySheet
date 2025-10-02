import React, { Suspense } from 'react';
import { Spinner } from '@components/Ui';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

const AppRouter = React.lazy(() => import('./AppRouter'));

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-600 p-4">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <pre className="mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 rounded bg-red-100 hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spinner />}>
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
