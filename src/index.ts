/**
 * src/index.ts - Central export point för main App-komponent
 *
 * Detta är entry point för src-mappen.
 *
 * Purpose:
 * - Exporterar App-komponenten för användning i main.tsx
 * - Enkel barrel export för huvudkomponenten
 *
 * Användning:
 * - main.tsx: import App from './App'
 * - Eller: import { App } from './index'
 *
 * Note:
 * - Detta är en mycket enkel index-fil
 * - Endast en export (App)
 * - Kunde skippa denna fil och importera direkt från App.tsx
 * - Men konsekvent med andra index-filer i projektet
 */

// Exporterar App-komponenten som default export
export { default as App } from './App';
