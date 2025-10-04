/**
 * HomePage.tsx - Landningssida och filuppladdningsvy för SavvySheet
 *
 * Detta är den första sidan användaren ser när de besöker applikationen.
 *
 * Huvudfunktioner:
 * - Visuellt tilltalande landningssida med animerad titel
 * - Filuppladdning via drag-and-drop eller klick
 * - Animerad bakgrund med BoxesContainer
 * - Automatisk navigering till /sheet när fil laddats upp
 *
 * Animationer:
 * - Title fade-in från toppen
 * - Upload-komponent zoom-in från botten
 * - Bakgrundsoverlay fade-in
 * - Animated boxes för visuell effekt
 *
 * Användarflöde:
 * 1. Användaren ser titel och uppladdningsområde
 * 2. Laddar upp Excel-fil (.xlsx)
 * 3. Filen parsas av UploadFile-komponenten
 * 4. handleDataParsed anropas med parsed data
 * 5. Automatisk navigering till /sheet för att visa datan
 */

import React, { useCallback, useState, useEffect, Suspense, lazy, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFile } from '@components/Upload';
import type { SheetData } from '@types';
import { motion } from 'framer-motion';

/**
 * BoxesContainer: Lazy-loaded bakgrundsanimation
 * Memoized för att undvika onödiga re-renders
 * Visar animerade rutor i bakgrunden för visuell effekt
 */
const BoxesContainer = memo(lazy(() => import('@components/Ui/BoxesContainer')));

/**
 * HomePageProps - Props-interface för HomePage
 *
 * @property {Function} onDataParsed - Callback som anropas när Excel-fil har parsats
 *   @param {SheetData} parsedSheets - Det parsade sheet-datat
 *   @param {string} fileName - Namnet på den uppladdade filen
 */
type HomePageProps = {
  onDataParsed: (parsedSheets: SheetData, fileName: string) => void;
};

/**
 * titleMotion - Framer Motion animation för titeln
 *
 * Konfiguration:
 * - initial: Osynlig och -20px från slutposition
 * - animate: Fade in till full opacitet och rätt position
 * - transition: 1 sekund duration med 0.7 sekunder delay
 */
const titleMotion = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.7 },
};

/**
 * HomePage - Huvudkomponent för landningssidan
 *
 * @param {HomePageProps} props - Props med onDataParsed callback
 * @returns {JSX.Element} Renderad landningssida
 */
const HomePage: React.FC<HomePageProps> = ({ onDataParsed }) => {
  /**
   * navigate: React Router hook för programmatisk navigering
   * Används för att navigera till /sheet efter filuppladdning
   */
  const navigate = useNavigate();

  /**
   * showBoxes: State för att kontrollera om bakgrundsanimationen ska visas
   * Sätts till true efter 500ms för att förbättra initial laddningsprestanda
   * Lazy loading av BoxesContainer reducerar initial bundle size
   */
  const [showBoxes, setShowBoxes] = useState(false);

  /**
   * useEffect: Aktiverar bakgrundsanimationen efter en kort fördröjning
   *
   * Detta förbättrar initial laddningsprestanda genom att:
   * 1. Låta huvudinnehållet rendera först
   * 2. Ladda den tunga BoxesContainer-animationen i bakgrunden
   * 3. Cleanup-funktionen städar upp timeout vid unmount
   */
  useEffect(() => {
    const timeout = setTimeout(() => setShowBoxes(true), 500);
    // Cleanup: Rensa timeout om komponenten unmountas innan 500ms
    return () => clearTimeout(timeout);
  }, []); // Tom dependency array = kör bara en gång vid mount

  /**
   * handleDataParsed - Wrapper-callback för filuppladdning
   *
   * Anropas när UploadFile-komponenten har parsad en fil.
   *
   * @param {SheetData} parsedSheets - Det parsade datat från Excel-filen
   * @param {string} fileName - Namnet på den uppladdade filen
   *
   * Flöde:
   * 1. Anropar onDataParsed (från AppRouter) för att uppdatera global state
   * 2. Navigerar till /sheet för att visa det uppladdade datat
   *
   * useCallback: Memoized för att undvika onödiga re-renders av barn-komponenter
   * Dependencies: onDataParsed och navigate (stabila funktioner)
   */
  const handleDataParsed = useCallback(
    (parsedSheets: SheetData, fileName: string) => {
      onDataParsed(parsedSheets, fileName);
      navigate('/sheet');
    },
    [onDataParsed, navigate],
  );

  return (
    /**
     * Huvudcontainer: Fullscreen layout med dark theme
     * - min-h-screen: Täcker minst hela viewport-höjden
     * - bg-neutral-950: Mycket mörk bakgrund
     * - flex flex-col: Vertikal flex-layout
     * - relative: Positioneringskontext för absolut positionerade barn
     * - overflow-hidden: Döljer allt som går utanför bounds
     */
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center relative overflow-hidden rounded-lg">
      {/**
       * Bakgrundsoverlay: Semi-transparent lager ovanpå bakgrunden
       * - absolute inset-0: Täcker hela förälderns yta
       * - z-20: Högre än boxes (z-10) men lägre än content (z-30)
       * - pointer-events-none: Låter klick passera igenom
       * - will-change-opacity: Hint till browser för optimerad animation
       *
       * Animation:
       * - Fade in från 0 till 0.7 opacity över 1.5 sekunder
       * - Ger en subtil darkening-effekt
       */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-neutral-900 z-20 pointer-events-none will-change-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      />

      {/**
       * BoxesContainer wrapper: Conditional rendering av bakgrundsanimation
       *
       * Struktur:
       * - Renderas endast när showBoxes är true (efter 500ms)
       * - absolute inset-0: Täcker hela förälderns yta
       * - z-10: Under overlay (z-20) och content (z-30)
       *
       * Suspense fallback: Visar en enkel grå bakgrund medan BoxesContainer laddas
       * Detta ger en smooth övergång och undviker layout shift
       */}
      {showBoxes && (
        <div className="absolute inset-0 z-10">
          <Suspense fallback={<div className="absolute inset-0 bg-neutral-900 opacity-10" />}>
            <BoxesContainer />
          </Suspense>
        </div>
      )}

      {/**
       * Main content wrapper: Centrerat innehåll ovanpå bakgrund
       * - z-30: Högst z-index, ligger ovanpå allt annat
       * - gap-12: Stort gap mellan titel och upload-komponent
       * - min-h-screen: Säkerställer att innehållet är vertikalt centrerat
       */}
      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen gap-12 relative z-30">
        {/**
         * Titel-sektion: Animerad SavvySheet-logotyp
         *
         * Motion.div: Framer Motion wrapper för animation
         * - {...titleMotion}: Spread animation-konfiguration (fade in från toppen)
         * - mt-16 mb-2: Margin för spacing
         */}
        <motion.div {...titleMotion} className="mt-16 mb-2">
          {/**
           * H1 titel: Huvudlogotyp med neon-effekt
           *
           * Styling:
           * - font-grand-hotel: Cursive font importerad från Google Fonts
           * - text-5xl sm:text-7xl md:text-9xl: Responsiv font size
           * - textShadow: Cyan neon glow-effekt i flera lager
           *   - 0 0 8px: Närmaste glow
           *   - 0 0 12px: Medel glow
           *   - 0 0 16px: Yttersta glow
           */}
          <h1
            className="font-grand-hotel text-5xl sm:text-7xl md:text-9xl font-extrabold text-white text-center"
            style={{ textShadow: '0 0 8px #0ff, 0 0 12px #0ff, 0 0 16px #0ff' }}
          >
            SavvySheet
          </h1>
        </motion.div>

        {/**
         * Upload-sektion: Filuppladdning med animation
         *
         * Motion.div animation:
         * - initial: Startar med låg opacity, skalad ner (0.9) och 40px ner
         * - animate: Full opacity, normal skala (1) och rätt position
         * - transition:
         *   - type: 'spring': Använder spring-physics för naturlig rörelse
         *   - stiffness: 100: Fjäderstyvhet (högre = snabbare)
         *   - damping: 20: Dämpning (lägre = mer studs)
         *   - delay: 0.5s: Väntar innan animation startar
         */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40, boxShadow: '0px 0px 0px rgba(0,255,180,0)' }}
          animate={{ opacity: 1, scale: 1, y: 0, boxShadow: '0px 0px 0px rgba(0,255,180,0)' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
          className="flex justify-center"
        >
          {/**
           * UploadFile-komponent: Hanterar filuppladdning
           *
           * Props:
           * - onDataParsed: Callback som anropas när fil är parsad
           *
           * Funktionalitet:
           * - Drag-and-drop område
           * - Filväljare vid klick
           * - Validering av .xlsx-filer
           * - Parsing med xlsx-biblioteket
           * - Loading state under parsing
           */}
          <UploadFile onDataParsed={handleDataParsed} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
