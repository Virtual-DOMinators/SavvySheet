/**
 * EditableTable.tsx - AG Grid-baserad redigerbar tabell för Excel-data
 *
 * Detta är kärnan i SavvySheets redigeringsfunktionalitet.
 * Använder AG Grid Community Edition för kraftfull tabellhantering.
 *
 * Funktioner:
 * - Visa Excel-data i ett kraftfullt grid
 * - Inline cell-redigering (klicka för att redigera)
 * - Auto-genererade kolumner från data
 * - Automatisk sparning vid cell-ändring eller mouse leave
 * - Sortering och filtrering (AG Grid features)
 * - Type-safe data handling
 *
 * AG Grid features:
 * - Virtualisering för prestanda (stora datasets)
 * - Editable cells
 * - Column resizing
 * - Sortable columns
 * - Filterable columns
 *
 * Data flow:
 * 1. Användaren redigerar en cell
 * 2. onCellValueChanged triggas
 * 3. saveData extraherar all grid-data
 * 4. Jämför med lastSavedData för att undvika onödiga sparningar
 * 5. Anropar dataOnChange callback med uppdaterad data
 * 6. Parent (SheetView/SheetPage) uppdaterar state
 * 7. useLocalSheet sparar automatiskt till localStorage
 */

import React, { useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community';
import { isEqual, getColumnDefs } from '@utils';
import type { EditableTableProps, ExcelRow } from '@types';

/**
 * ModuleRegistry: Registrera AG Grid community modules
 *
 * Detta måste göras innan AG Grid används.
 * AllCommunityModule innehåller alla gratis AG Grid features.
 */
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * EditableTable - Huvudkomponent för redigerbar tabell
 *
 * @param {EditableTableProps} props - Props med data och callback
 * @returns {JSX.Element} AG Grid tabell eller tom-state meddelande
 */
const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  /**
   * gridApiRef: Ref till AG Grid API för programmatisk kontroll
   *
   * Används för:
   * - stopEditing(): Stoppa pågående redigering
   * - forEachNode(): Iterera över alla rader för att extrahera data
   *
   * Sätts i onGridReady callback
   */
  const gridApiRef = useRef<GridApi | null>(null);

  /**
   * lastSavedDataRef: Ref för att tracka senast sparade data
   *
   * Purpose:
   * - Undvika onödiga sparningar om data inte ändrats
   * - Jämförelse görs med isEqual utility
   * - Uppdateras efter varje lyckad sparning
   *
   * Note: Använder ref istället för state eftersom vi inte behöver re-render
   */
  const lastSavedDataRef = useRef<ExcelRow[]>(data);

  /**
   * colDefs: Kolumndefinitioner för AG Grid
   *
   * Genereras från data med getColumnDefs utility
   *
   * Varje kolumn får:
   * - field: Property-namn från data
   * - editable: true (tillåt inline-redigering)
   * - flex: 1 (flexibel bredd, delar space jämnt)
   * - sortable: true (tillåt sortering)
   * - filter: true (tillåt filtrering)
   */
  const colDefs: ColDef[] = getColumnDefs(data);

  /**
   * saveData - Callback för att spara grid-data
   *
   * Process:
   * 1. Kontrollera att gridApi finns
   * 2. Stoppa pågående redigering (för att få senaste värdet)
   * 3. Iterera över alla noder (rader) i gridet
   * 4. Extrahera och type-checka varje cell-värde
   * 5. Bygg upp updatedData array
   * 6. Jämför med lastSavedData
   * 7. Om ändringar finns, spara och anropa callback
   *
   * useCallback: Memoized för att undvika onödiga re-renders
   * Dependencies: dataOnChange
   *
   * Triggas av:
   * - onCellValueChanged: När användaren ändrar en cell
   * - onMouseLeave: När musen lämnar grid-området
   */
  const saveData = useCallback(() => {
    // Safety check: Säkerställ att gridApi finns
    if (!gridApiRef.current) return;

    // Stoppa pågående redigering för att få senaste värdet
    gridApiRef.current.stopEditing();

    // Array för att samla uppdaterad data
    const updatedData: ExcelRow[] = [];

    /**
     * forEachNode: Iterera över alla rader i gridet
     *
     * @param node - AG Grid node-objekt med row data
     *
     * För varje rad:
     * 1. Skapa tom ExcelRow
     * 2. Iterera över alla properties i row data
     * 3. Type-check varje värde (string, number, boolean, null)
     * 4. Konvertera övriga typer till string
     * 5. Lägg till rad till updatedData
     */
    gridApiRef.current.forEachNode((node) => {
      const row: ExcelRow = {};

      // Iterera över alla key-value pairs i raden
      Object.entries(node.data as Record<string, unknown>).forEach(([key, value]) => {
        /**
         * Type checking och konvertering:
         *
         * Tillåtna typer för ExcelRow (enligt type definition):
         * - string: Text-värden
         * - number: Numeriska värden
         * - boolean: True/false
         * - null: Tomma celler
         *
         * Andra typer konverteras till string för säkerhet
         */
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null
        ) {
          row[key] = value;
        } else {
          // Fallback: Konvertera oväntade typer till string
          row[key] = String(value);
        }
      });

      // Lägg till processed rad till array
      updatedData.push(row);
    });

    /**
     * Jämför med lastSavedData för att undvika onödiga callbacks
     *
     * isEqual: Deep equality check via JSON.stringify
     *
     * Om data inte ändrats:
     * - Skippa callback
     * - Spara resurser
     * - Undvik onödiga re-renders i parent
     *
     * Om data ändrats:
     * - Uppdatera lastSavedDataRef
     * - Anropa dataOnChange callback
     * - Parent uppdaterar state
     * - useLocalSheet sparar till localStorage
     */
    if (!isEqual(updatedData, lastSavedDataRef.current)) {
      lastSavedDataRef.current = updatedData;
      dataOnChange(updatedData);
    }
  }, [dataOnChange]);

  return (
    /**
     * Outer wrapper: Full bredd och höjd container
     */
    <div className="w-full h-full">
      {/**
       * Conditional rendering: Tom state vs grid
       *
       * Om data.length === 0:
       * - Visa placeholder-meddelande
       * - Användaren har inte laddat upp någon fil ännu
       *
       * Annars:
       * - Visa AG Grid med data
       */}
      {data.length === 0 ? (
        /**
         * Empty state: Meddelande när ingen data finns
         *
         * Styling:
         * - flex items-center justify-center: Centrerat innehåll
         * - h-full: Full höjd
         * - rounded-md: Rundade hörn
         * - text-gray-600: Grå text
         * - italic: Kursiv stil
         * - border-2 border-gray-400: Border runt området
         */
        <div className="flex items-center justify-center h-full rounded-md text-gray-600 italic border-2 border-gray-400">
          Ingen fil uppladdad än!
        </div>
      ) : (
        /**
         * Grid wrapper: Container för AG Grid
         *
         * onMouseLeave: Spara data när musen lämnar området
         * - Detta säkerställer att ändringar sparas även om användaren inte
         *   navigerar bort från cellen
         * - Ger smooth UX utan explicit "Save"-knapp
         *
         * height calc: Dynamisk höjd
         * - calc(100vh - 250px): Viewport-höjd minus header och padding
         * - Ger grid max space utan scrolling av sidan
         */
        <div
          onMouseLeave={saveData}
          className="w-full h-full"
          style={{ height: 'calc(100vh - 250px)' }}
        >
          {/**
           * AG Theme wrapper: Tillämpar AG Grid tema
           *
           * ag-theme-alpine: Ett av AG Grids inbyggda teman
           * - Ren, modern look
           * - Bra kontrast och läsbarhet
           */}
          <div className="ag-theme-alpine w-full h-full">
            {/**
             * AgGridReact: Huvudkomponenten för AG Grid
             *
             * Props:
             * - rowData: Data att visa i gridet
             * - theme: Tema-objekt (themeAlpine)
             * - columnDefs: Kolumndefinitioner (auto-genererade)
             * - onGridReady: Callback när grid är initialiserat
             *   - Sparar GridApi i ref för senare användning
             *   - Type assertion till GridApi för TypeScript
             * - onCellValueChanged: Callback när cell-värde ändras
             *   - Triggar saveData för att spara ändringar
             *   - Ger auto-save funktionalitet
             *
             * AG Grid features (implicit):
             * - Cell editing vid klick/dubbelklick
             * - Sortering via kolumn-headers
             * - Filtrering via filter-ikoner
             * - Column resizing via drag på header-dividers
             * - Virtualisering för stora datasets
             */}
            <AgGridReact
              rowData={data}
              theme={themeAlpine}
              columnDefs={colDefs}
              onGridReady={(params) => {
                gridApiRef.current = params.api as GridApi;
              }}
              onCellValueChanged={saveData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTable;
