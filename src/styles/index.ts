/**
 * styles/index.ts - Entry point för globala stilar
 *
 * Detta är entry point för att importera alla CSS-filer.
 *
 * Purpose:
 * - Importera index.css som innehåller alla stilar
 * - Single import point för styles i main.tsx
 *
 * index.css innehåller:
 * - Tailwind CSS imports (@import 'tailwindcss')
 * - DaisyUI configuration
 * - Custom CSS classes (.font-grand-hotel, .animated-gradient-bg, etc.)
 * - Animation keyframes (@keyframes)
 * - Custom styling för komponenter
 *
 * Användning i main.tsx:
 * ```typescript
 * import '@styles';
 * ```
 *
 * Detta laddar alla stilar globalt för hela applikationen.
 */

// Importerar index.css med alla globala stilar
import './index.css';
