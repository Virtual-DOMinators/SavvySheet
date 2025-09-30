import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Spinner } from '@components/ui';
import '@styles';

const App = React.lazy(() => import('./App'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </StrictMode>,
);
