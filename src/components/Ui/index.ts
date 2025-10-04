/**
 * components/Ui/index.ts - Export point för UI-komponenter
 *
 * Detta är en barrel export file för generella UI-komponenter.
 *
 * Purpose:
 * - Centraliserad import-punkt för UI-komponenter
 * - Enklare imports: import { Spinner, BoxesContainer } from '@components/Ui'
 *
 * Komponenter:
 * - Spinner: Loading spinner-komponent
 * - BoxesContainer: Animerad bakgrunds-grid för HomePage
 *
 * Användning:
 * ```typescript
 * import { Spinner, BoxesContainer } from '@components/Ui';
 *
 * <Suspense fallback={<Spinner />}>
 *   <Component />
 * </Suspense>
 *
 * <BoxesContainer />
 * ```
 */

// Exporterar Spinner-komponenten för loading states
export { default as Spinner } from './Spinner';

// Exporterar BoxesContainer-komponenten för bakgrundsanimation
export { default as BoxesContainer } from './BoxesContainer';
