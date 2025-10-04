/**
 * SheetPage.tsx - Sida för att visa och redigera Excel sheets
 *
 * Detta är huvudvyn där användare kan se och redigera sina uppladdade Excel-filer.
 *
 * Huvudfunktioner:
 * - Visa sheet-data i en redigerbar tabell (AG Grid)
 * - Navigering mellan flera sheets (om filen innehåller flera)
 * - Export till PDF via Header dropdown
 * - Persistent state med localStorage
 * - Lazy loading av tunga komponenter
 *
 * Komponentstruktur:
 * - Header: Visar logo, titel och export-meny
 * - SheetView: Visar och redigerar data för aktuellt sheet
 * - SheetNavigation: Navigeringsknappar mellan sheets (om flera finns)
 *
 * Dataflöde:
 * 1. Tar emot sheets och kolumner från AppRouter
 * 2. Använder currentSheetIdx för att visa rätt sheet
 * 3. Vid data-ändringar uppdateras sheets via setSheets callback
 * 4. useLocalSheet sparar automatiskt ändringar till localStorage
 */

import React, { useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import type { ExcelRow, SheetData, ExportColumn } from '@types';
import { useLocalSheet } from '@hooks';

/**
 * SheetPageProps - Interface för props som SheetPage tar emot
 *
 * @property {SheetData} sheets - Objekt med alla sheets och deras data
 * @property {Record<string, ExportColumn<ExcelRow>[]>} columns - Kolumndefinitioner per sheet
 * @property {string} filename - Namnet på den uppladdade filen (optional)
 * @property {number} currentSheetIdx - Index för vilket sheet som visas
 * @property {Function} setSheets - Callback för att uppdatera sheets-data
 * @property {Function} setCurrentSheetIdx - Callback för att ändra aktivt sheet
 * @property {Function} setFilename - Callback för att uppdatera filnamn (optional)
 */
interface SheetPageProps {
  sheets: SheetData;
  columns: Record<string, ExportColumn<ExcelRow>[]>;
  filename?: string;
  currentSheetIdx: number;
  setSheets: React.Dispatch<React.SetStateAction<SheetData>>;
  setCurrentSheetIdx: (idx: number) => void;
  setFilename?: (f: string) => void;
}

/**
 * Lazy-loaded komponenter för code splitting och bättre prestanda
 *
 * Header: Importeras dynamiskt när den behövs
 * SheetView: Importeras dynamiskt (innehåller tung AG Grid)
 * SheetNavigation: Importeras dynamiskt
 *
 * Fördelar:
 * - Mindre initial bundle size
 * - Snabbare första laddning
 * - Komponenter laddas parallellt när de behövs
 */
const Header = React.lazy(() => import('@components/Layout/Header'));
const SheetView = React.lazy(() => import('@components/Sheet/SheetView'));
const SheetNavigation = React.lazy(() => import('@components/Sheet/SheetNavigation'));

/**
 * Spinner - Loading indicator som visas medan lazy-loaded komponenter laddas
 *
 * Design:
 * - Fixed fullscreen overlay med semi-transparent bakgrund
 * - Animerad spinner i cyan/pink färger (matchar app-tema)
 * - z-50 för att ligga ovanpå allt annat innehåll
 *
 * @returns {JSX.Element} Centrerad spinner med dark overlay
 */
const Spinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-70 z-50">
    {/* Border-animation skapar rotationseffekt */}
    <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-400 border-cyan-600 rounded-full animate-spin" />
  </div>
);

/**
 * SheetPage - Huvudkomponent för sheet-visning och redigering
 *
 * @param {SheetPageProps} props - Props med sheets, columns, callbacks etc.
 * @returns {JSX.Element} Renderad sheet-sida med tabell och navigation
 */
const SheetPage: React.FC<SheetPageProps> = ({
  sheets,
  columns,
  filename,
  currentSheetIdx,
  setSheets,
  setCurrentSheetIdx,
  setFilename,
}) => {
  /**
   * useLocalSheet: Synkroniserar sheets och filename med localStorage
   *
   * Funktionalitet:
   * - Laddar data från localStorage vid första render
   * - Sparar automatiskt när data ändras (med debounce)
   * - Använder samma keys som AppRouter för konsistens
   */
  useLocalSheet(sheets, setSheets, filename, setFilename);

  /**
   * sheetNames: Array med alla sheet-namn från sheets-objektet
   *
   * useMemo: Beräknas om endast när sheets ändras
   * Används för:
   * - Att hämta rätt sheet baserat på currentSheetIdx
   * - Att avgöra om navigation ska visas (length > 1)
   *
   * Exempel: ["Sheet1", "Sheet2", "Customers"]
   */
  const sheetNames = useMemo(() => Object.keys(sheets), [sheets]);

  /**
   * flatColumns: Flattar alla kolumner från alla sheets till en array
   *
   * useMemo: Beräknas om endast när columns ändras
   * Används för: Export-funktionalitet i Header (PDF-generering)
   *
   * Transformation:
   * Input: { Sheet1: [col1, col2], Sheet2: [col3, col4] }
   * Output: [col1, col2, col3, col4]
   */
  const flatColumns = useMemo(() => Object.values(columns).flat(), [columns]);

  /**
   * handleNext - Navigera till nästa sheet
   *
   * Logik:
   * - Ökar currentSheetIdx med 1
   * - Math.min säkerställer att vi inte går över sista sheet
   * - Exempel: Om på index 0 av 3 sheets, går till index 1
   */
  const handleNext = () => setCurrentSheetIdx(Math.min(currentSheetIdx + 1, sheetNames.length - 1));

  /**
   * handlePrev - Navigera till föregående sheet
   *
   * Logik:
   * - Minskar currentSheetIdx med 1
   * - Math.max säkerställer att vi inte går under index 0
   * - Exempel: Om på index 2, går till index 1
   */
  const handlePrev = () => setCurrentSheetIdx(Math.max(currentSheetIdx - 1, 0));

  /**
   * Early return: Om inga sheets finns (tom upload)
   *
   * Visar:
   * - Header med tom data (för logo och eventuell navigation tillbaka)
   * - Meddelande att ingen fil är uppladdad
   *
   * Suspense: Behövs fortfarande eftersom Header är lazy-loaded
   */
  if (sheetNames.length === 0) {
    return (
      <Suspense fallback={<Spinner />}>
        <Header sheets={sheets} columns={flatColumns} filename={filename} />
        <div className="text-center text-gray-500 mt-12">Ingen fil uppladdad ännu.</div>
      </Suspense>
    );
  }

  /**
   * Huvudrendering: Visa sheet-data med tabell och navigation
   *
   * Motion.div: Framer Motion wrapper för fade-in animation
   * - initial: Startar osynlig och 20px neråt
   * - animate: Fade in till synlig och rätt position
   * - transition: 0.6 sekunder animation
   * - className: min-h-screen för fullhöjd
   */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      {/**
       * Suspense: Wrapper för alla lazy-loaded komponenter
       *
       * fallback: Visar Spinner medan komponenter laddas
       * Detta ger smooth loading experience utan layout shift
       */}
      <Suspense fallback={<Spinner />}>
        {/**
         * Header-komponent: Visar navigation och export-funktionalitet
         *
         * Props:
         * - sheets: Alla sheet-data (för export)
         * - columns: Flatade kolumner (för PDF-generering)
         * - filename: För att namnge exported fil
         */}
        <Header sheets={sheets} columns={flatColumns} filename={filename} />

        {/**
         * Main content wrapper: Container för tabell och navigation
         *
         * Layout:
         * - flex flex-col: Vertikal stack av SheetView och SheetNavigation
         * - gap-4: Mellanrum mellan element
         * - p-2: Padding på små skärmar
         * - lg:pl-10 lg:pr-10: Större padding på stora skärmar
         */}
        <div className="flex flex-col gap-4 p-2 lg:pl-10 lg:pr-10">
          {/**
           * SheetView: Huvudkomponent för att visa och redigera sheet-data
           *
           * Props:
           * - sheetName: Namnet på aktuellt sheet (från sheetNames[currentSheetIdx])
           * - data: Raddata för aktuellt sheet
           * - columns: Kolumndefinitioner för aktuellt sheet
           * - originalFileName: För metadata/referens
           * - onDataChange: Callback när användaren ändrar data i tabellen
           *
           * onDataChange callback:
           * - Tar emot newData (uppdaterad array av rader)
           * - Uppdaterar sheets state via setSheets
           * - Behåller alla andra sheets oförändrade (spread ...prev)
           * - Uppdaterar endast aktuellt sheet
           */}
          <SheetView
            sheetName={sheetNames[currentSheetIdx]}
            data={sheets[sheetNames[currentSheetIdx]]}
            columns={columns[sheetNames[currentSheetIdx]]}
            originalFileName={filename}
            onDataChange={(newData: ExcelRow[]) =>
              setSheets((prev) => ({
                ...prev,
                [sheetNames[currentSheetIdx]]: newData,
              }))
            }
          />

          {/**
           * SheetNavigation: Conditional rendering av navigeringsknappar
           *
           * Villkor: Visas endast om filen innehåller fler än 1 sheet
           *
           * Props:
           * - currentIdx: Aktuellt sheet-index (för att disable rätt knappar)
           * - maxIdx: Högsta index (sheetNames.length - 1)
           * - onPrev: Callback för föregående-knapp
           * - onNext: Callback för nästa-knapp
           *
           * Knappar disablas automatiskt vid gränser:
           * - Prev disabled när currentIdx === 0
           * - Next disabled när currentIdx === maxIdx
           */}
          {sheetNames.length > 1 && (
            <div className="">
              <SheetNavigation
                currentIdx={currentSheetIdx}
                maxIdx={sheetNames.length - 1}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          )}
        </div>
      </Suspense>
    </motion.div>
  );
};

export default SheetPage;
