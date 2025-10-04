/**
 * Main.tsx - Applikationens huvudsakliga startpunkt
 *
 * Detta är entry point för hela React-applikationen.
 * Filen ansvarar för att:
 * - Hitta root-elementet i DOM:en (#root från index.html)
 * - Skapa en React-root med createRoot (React 18+ API)
 * - Rendera hela applikationen inuti StrictMode
 * - Importera globala CSS-stilar
 */

// React-specifika imports för rendering och StrictMode
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Globala stilar för hela applikationen (Tailwind, daisyUI, custom CSS)
import '@styles';

// Huvudkomponenten som innehåller hela applikationen
import App from './App';

// Hämta root-elementet från DOM:en där React ska mountas
// Detta element måste finnas i index.html för att applikationen ska fungera
const container = document.getElementById('root');

// Säkerhetscheck: om root-elementet inte finns, kasta ett felmeddelande
// Detta hjälper till att fånga konfigurationsfel tidigt i utvecklingen
if (!container) {
  throw new Error('Root element not found. Make sure index.html has a <div id="root"></div>');
}

// Skapa en React-root och rendera applikationen
// StrictMode aktiverar extra utvecklingsvarningar och kontroller
// för att hjälpa till att identifiera potentiella problem
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
