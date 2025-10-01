import React, { Suspense } from 'react';
import { Spinner } from '@components/Ui';

const AppRouter = React.lazy(() => import('./AppRouter'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
