/**
 * pages/index.ts - Central export point för page-komponenter
 *
 * Detta är en barrel export file för alla page-komponenter.
 *
 * Purpose:
 * - Centraliserad import-punkt för pages
 * - Enklare imports: import { HomePage, SheetPage } from '@pages'
 * - Istället för: import HomePage from '@pages/HomePage'; import SheetPage from '@pages/SheetPage';
 *
 * Pages:
 * - HomePage: Landningssida med filuppladdning
 * - SheetPage: Sheet-visning och redigering
 *
 * Användning i AppRouter:
 * ```typescript
 * import { HomePage, SheetPage } from '@pages';
 *
 * <Routes>
 *   <Route path="/" element={<HomePage ... />} />
 *   <Route path="/sheet" element={<SheetPage ... />} />
 * </Routes>
 * ```
 *
 * Pattern:
 * - export { default as Name } from './filename'
 * - Re-exporterar default export med nytt namn
 * - Gör det möjligt att importera som named export
 */

// Exporterar HomePage-komponenten
export { default as HomePage } from './HomePage';

// Exporterar SheetPage-komponenten
export { default as SheetPage } from './SheetPage';
