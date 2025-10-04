/**
 * AppRouter.tsx - Central routing och state management för SavvySheet
 *
 * Detta är hjärtat i applikationens routing och state management.
 *
 * Ansvar:
 * - Hantera global state för sheets (Excel-data), filnamn och kolumner
 * - Routing mellan HomePage (uppladdning) och SheetPage (visning/redigering)
 * - Persistens av data via useLocalSheet hook
 * - Koordinera dataflöde mellan komponenter
 *
 * State-struktur:
 * - sheets: Objekt med sheet-namn som nycklar, arrays av rader som värden
 * - filename: Namnet på den uppladdade filen
 * - columns: Genererade kolumndefinitioner för varje sheet
 * - currentSheetIdx: Index för vilket sheet som visas (vid flera sheets)
 *
 * Routing:
 * - "/" (HomePage): Filuppladdning och landningssida
 * - "/sheet" (SheetPage): Visa och redigera data i sheets
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, SheetPage } from '@pages';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { SheetData } from '@types';

/**
 * AppRouter - Huvudkomponent för routing och global state
 *
 * Dataflöde:
 * 1. Användaren laddar upp fil på HomePage
 * 2. handleDataParsed tar emot parsed data och filnamn
 * 3. State uppdateras och sparas automatiskt via useLocalSheet
 * 4. Navigering till /sheet visar SheetPage med datan
 * 5. Ändringar i SheetPage uppdaterar sheets state
 * 6. useLocalSheet sparar ändringar automatiskt till localStorage
 *
 * @returns {JSX.Element} BrowserRouter med alla routes
 */
function AppRouter() {
  /**
   * sheets: Huvuddatan - objekt där varje nyckel är ett sheet-namn
   * och värdet är en array av rader (ExcelRow[])
   * Exempel: { "Sheet1": [{col1: "val1", col2: "val2"}, ...], "Sheet2": [...] }
   */
  const [sheets, setSheets] = useState<SheetData>({});

  /**
   * filename: Namnet på den uppladdade filen, används för export-filnamn
   * Undefined vid initial laddning eller när ingen fil har laddats upp
   */
  const [filename, setFilename] = useState<string>();

  /**
   * useLocalSheet hook: Automatisk persistens till/från localStorage
   * - Laddar data från localStorage vid initial mount
   * - Sparar automatiskt när sheets eller filename ändras
   * - Använder debouncing (200ms) för att undvika för många sparningar
   */
  useLocalSheet(sheets, setSheets, filename, setFilename);

  /**
   * useSheetColumns hook: Genererar kolumndefinitioner från sheets-data
   * Returnerar ett objekt med sheet-namn som nycklar och kolumn-arrays som värden
   * Används av AG Grid för att veta vilka kolumner som ska visas
   * Memoized för att undvika onödiga beräkningar
   */
  const columns = useSheetColumns(sheets);

  /**
   * currentSheetIdx: Håller reda på vilket sheet (index) som visas för tillfället
   * Används när Excel-filen innehåller flera sheets
   * Återställs till 0 när en ny fil laddas upp
   */
  const [currentSheetIdx, setCurrentSheetIdx] = useState<number>(0);

  /**
   * handleDataParsed - Callback som anropas när en fil har parsats
   *
   * @param {SheetData} parsedSheets - Det parsade sheet-datat från Excel-filen
   * @param {string} fileName - Namnet på den uppladdade filen
   *
   * Flöde:
   * 1. Uppdaterar sheets state med ny data
   * 2. Uppdaterar filename state
   * 3. Återställer currentSheetIdx till 0 (första sheet)
   * 4. useLocalSheet sparar automatiskt till localStorage
   */
  const handleDataParsed = (parsedSheets: SheetData, fileName: string) => {
    setSheets(parsedSheets);
    setFilename(fileName);
    setCurrentSheetIdx(0);
  };

  return (
    /**
     * BrowserRouter: Huvudsaklig router-komponent från react-router-dom
     * basename="/SavvySheet": Basväg för GitHub Pages deployment
     *
     * Detta betyder att alla routes prefixas med /SavvySheet
     * Exempel: Faktisk URL blir https://domain.com/SavvySheet/sheet
     */
    <BrowserRouter basename="/SavvySheet">
      {/* Main wrapper: Ger min-höjd för konsistent layout */}
      <main className="min-h-screen">
        {/* Routes: Definierar alla möjliga routes i applikationen */}
        <Routes>
          {/* 
            Route 1: HomePage - Landningssida och filuppladdning
            Path: "/" (blir /SavvySheet/ med basename)
            Props: onDataParsed callback för när fil är uppladdad
          */}
          <Route path="/" element={<HomePage onDataParsed={handleDataParsed} />} />

          {/* 
            Route 2: SheetPage - Visa och redigera Excel sheets
            Path: "/sheet" (blir /SavvySheet/sheet med basename)
            Props: 
            - sheets: Alla sheets med data
            - columns: Kolumndefinitioner för varje sheet
            - filename: Uppladdad fils namn
            - currentSheetIdx: Vilket sheet som visas
            - setSheets: För att uppdatera sheets-data vid redigering
            - setCurrentSheetIdx: För att navigera mellan sheets
          */}
          <Route
            path="/sheet"
            element={
              <SheetPage
                sheets={sheets}
                columns={columns}
                filename={filename}
                currentSheetIdx={currentSheetIdx}
                setSheets={setSheets}
                setCurrentSheetIdx={setCurrentSheetIdx}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default AppRouter;
