/**
 * BoxesContainer.tsx - Animerad bakgrundskomponent för HomePage
 *
 * Detta är en visuell effekt-komponent som visar ett grid av animerade rutor.
 *
 * Funktionalitet:
 * - Visa ett grid av rutor (12 rader x 20 kolumner = 240 rutor)
 * - Slumpmässigt highlighta en ruta var 2:a sekund
 * - Smooth color transitions mellan active/inactive states
 *
 * Prestanda-optimeringar:
 * - Memoized Box-komponent för att undvika re-renders
 * - Använder interval för animering istället för individuella timeouts
 * - Lazy-loaded (importeras dynamiskt i HomePage)
 *
 * Design:
 * - Subtila färgskiftningar (dark slate tones)
 * - Låg opacity för att inte distrahera från huvudinnehåll
 * - Smooth transitions (1000ms) för mjuka övergångar
 *
 * Används i:
 * - HomePage som bakgrundsanimation
 * - Renderas conditional efter 500ms för bättre initial load
 */

import { useEffect, useState, memo } from 'react';

/**
 * Grid-konfiguration: Dimensioner för box-gridet
 *
 * rows: 12 rader vertikalt
 * cols: 20 kolumner horisontellt
 * totalBoxes: Total antal rutor (12 * 20 = 240)
 *
 * Dessa värden är hårdkodade för optimal visuell balans på de flesta skärmar.
 */
const rows = 12;
const cols = 20;
const totalBoxes = rows * cols;

/**
 * Box - Memoized komponent för en individuell ruta
 *
 * Memoization:
 * - memo() förhindrar re-render om props inte ändras
 * - Eftersom 240 rutor renderas, är detta kritiskt för prestanda
 * - Endast rutan som blir active/inactive re-renderas
 *
 * @param {Object} props - Props för rutan
 * @param {boolean} props.active - Om rutan är i active state
 * @returns {JSX.Element} En animerad ruta
 *
 * Styling:
 * - Inline styles för dynamic backgroundColor och opacity
 * - Tailwind classes för layout och transitions
 *
 * Active state:
 * - backgroundColor: #ffffff (vit)
 * - opacity: 0.14 (väldigt subtil)
 *
 * Inactive state:
 * - backgroundColor: #0f172a (dark slate)
 * - opacity: 0.15 (nästan samma som active för subtil effekt)
 *
 * Transition:
 * - duration-1000: 1 sekund smooth transition
 * - ease-in-out: Smooth acceleration/deceleration
 */
const Box = memo(({ active }: { active: boolean }) => (
  <div
    style={{
      backgroundColor: active ? '#ffffff' : '#0f172a',
      opacity: active ? 0.14 : 0.15,
    }}
    className="flex-1 border opacity-20 border-slate-950 rounded-sm transition-colors duration-1000 ease-in-out"
  />
));

/**
 * BoxesContainer - Huvudkomponent för box-grid animation
 *
 * State:
 * - activeBox: Index för den ruta som är active (0-239)
 * - null betyder ingen ruta är active
 *
 * Animation logic:
 * - useEffect sätter upp interval
 * - Varje 2 sekunder väljs ett random box-index
 * - State uppdateras, vilket triggar re-render av den rutan
 * - Box-komponenten visar active state
 * - Efter 2 sekunder väljs ny ruta, och föregående blir inactive
 *
 * @returns {JSX.Element} Grid av animerade rutor
 */
export const BoxesContainer = () => {
  /**
   * activeBox: State för vilket box-index som är highlightat
   *
   * Värden:
   * - number (0-239): Index för active ruta
   * - null: Ingen ruta är active
   *
   * Initial state: null (ingen ruta highlightad vid mount)
   */
  const [activeBox, setActiveBox] = useState<number | null>(null);

  /**
   * useEffect: Sätter upp animation-interval
   *
   * Interval logic:
   * 1. Kör varje 2000ms (2 sekunder)
   * 2. Generera random index mellan 0 och totalBoxes-1
   * 3. Uppdatera activeBox state
   * 4. Detta triggar re-render av ny active box och föregående active box
   *
   * Cleanup:
   * - clearInterval när komponenten unmountas
   * - Förhindrar memory leaks
   *
   * Dependencies: [] (tom array)
   * - Körs endast en gång vid mount
   * - Interval fortsätter tills komponenten unmountas
   */
  useEffect(() => {
    const interval = setInterval(() => {
      // Generera random index för nästa active box
      setActiveBox(Math.floor(Math.random() * totalBoxes));
    }, 2000);

    // Cleanup: Rensa interval vid unmount
    return () => clearInterval(interval);
  }, []);

  return (
    /**
     * Container: Absolut positionerad fullscreen grid
     *
     * Classes:
     * - absolute inset-0: Täcker hela parent (HomePage)
     * - flex flex-col: Vertikal flex-layout för rader
     * - z-0: Lågt z-index (ligger under allt annat)
     *
     * Purpose:
     * - Täcker hela bakgrunden
     * - Ligger under content (z-30) och overlay (z-20)
     */
    <div className="absolute inset-0 flex flex-col z-0">
      {/**
       * Rows iteration: Skapar 12 rader
       *
       * Array.from({ length: rows }):
       * - Skapar array med 12 undefined-värden
       * - map över dessa för att skapa rad-komponenter
       *
       * Key: row-${i}
       * - Unik key för varje rad (React requirement)
       */}
      {Array.from({ length: rows }).map((_, i) => (
        /**
         * Row container: En rad i gridet
         *
         * Classes:
         * - flex: Horisontell flex-layout för rutor
         * - flex-1: Tar lika mycket space som andra rader
         * - w-full: Full bredd
         *
         * Key: row-${i} (0-11)
         */
        <div key={`row-${i}`} className="flex flex-1 w-full">
          {/**
           * Columns iteration: Skapar 20 rutor per rad
           *
           * Array.from({ length: cols }):
           * - Skapar array med 20 undefined-värden
           * - map över dessa för att skapa Box-komponenter
           *
           * Index calculation:
           * - index = i * cols + j
           * - Rad 0, kolumn 0: index = 0
           * - Rad 0, kolumn 19: index = 19
           * - Rad 1, kolumn 0: index = 20
           * - osv. upp till index 239
           *
           * Active check:
           * - index === activeBox: Denna ruta är active
           * - Annars: Inactive
           */}
          {Array.from({ length: cols }).map((_, j) => {
            const index = i * cols + j;
            return <Box key={j} active={index === activeBox} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default BoxesContainer;
