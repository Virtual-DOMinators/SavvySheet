/**
 * App.tsx - Huvudkomponent för SavvySheet-applikationen
 *
 * Detta är den högsta nivån i komponenthierarkin och ansvarar för:
 * - Error boundary: Fånga och hantera fel som uppstår i applikationen
 * - Code splitting: Lazy loading av AppRouter för bättre prestanda
 * - Loading state: Visa spinner medan AppRouter laddas
 *
 * Arkitektur:
 * - ErrorBoundary fångar alla runtime-fel i komponenter under
 * - Suspense hanterar lazy-loaded komponenter och visar fallback under laddning
 * - AppRouter innehåller all routing-logik och sidnavigering
 */

import React, { Suspense } from 'react';
import { Spinner } from '@components/Ui';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

/**
 * Lazy-load AppRouter för att dela upp kod i mindre chunks
 * Detta förbättrar initial laddningstid genom att bara ladda
 * routing-logiken när den behövs
 */
const AppRouter = React.lazy(() => import('./AppRouter'));

/**
 * ErrorFallback - Fallback-komponent som visas när ett fel uppstår
 *
 * @param {Object} props - Props från ErrorBoundary
 * @param {Error} props.error - Felobjektet som fångades
 * @param {Function} props.resetErrorBoundary - Funktion för att återställa error state
 *
 * Funktionalitet:
 * - Visar ett användarvänligt felmeddelande
 * - Visar teknisk information (error.message) för debugging
 * - Tillhandahåller en "Try again"-knapp för att återställa applikationen
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-600 p-4">
      {/* Rubrik för felmeddelandet */}
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>

      {/* Visar det specifika felmeddelandet i en pre-tag för läsbarhet */}
      <pre className="mb-4">{error.message}</pre>

      {/* Återställningsknapp som triggar resetErrorBoundary */}
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 rounded bg-red-100 hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
}

/**
 * App - Huvudkomponenten för hela applikationen
 *
 * Struktur:
 * 1. ErrorBoundary (ytterst): Fångar alla fel i barn-komponenter
 * 2. Suspense (inuti): Hanterar lazy-loading av AppRouter
 * 3. AppRouter (innerst): Innehåller routing och state management
 *
 * @returns {JSX.Element} Den renderade applikationen med error handling och loading states
 */
function App() {
  return (
    // ErrorBoundary fångar fel från alla barn-komponenter och visar ErrorFallback
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* Suspense visar Spinner medan AppRouter lazy-loadar */}
      <Suspense fallback={<Spinner />}>
        {/* AppRouter innehåller routing och huvudlogiken för applikationen */}
        <AppRouter />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
