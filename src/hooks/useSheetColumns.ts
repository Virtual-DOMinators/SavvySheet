/**
 * useSheetColumns.ts - Custom React Hook för att generera kolumndefinitioner från sheet-data
 *
 * Detta är en enkel men viktig hook som transformerar sheet-data till kolumndefinitioner.
 *
 * Funktionalitet:
 * - Ta emot SheetData (objekt med sheets)
 * - Generera kolumndefinitioner för varje sheet
 * - Returnera objekt med sheet-namn som nycklar och kolumn-arrays som värden
 * - Memoization för att undvika onödiga beräkningar
 *
 * Användning:
 * - I AppRouter för att generera columns från sheets
 * - Kolumnerna används av EditableTable (AG Grid)
 * - Också används för PDF-export funktionalitet
 *
 * Dataflöde:
 * 1. Sheets laddas upp eller ändras
 * 2. useSheetColumns tar emot nya sheets
 * 3. useMemo beräknar kolumner för varje sheet
 * 4. Returnerar columns-objekt
 * 5. EditableTable använder kolumnerna för att rendera grid
 * 6. Export använder kolumnerna för PDF-struktur
 */

import { useMemo } from 'react';
import type { ExportColumn, ExcelRow, SheetData } from '@types';
import { getColumnDefs } from '@utils';

/**
 * useSheetColumns - Hook för att generera kolumndefinitioner
 *
 * @param {SheetData} sheets - Objekt med alla sheets och deras data
 * @returns {Record<string, ExportColumn<ExcelRow>[]>} Objekt med kolumndefinitioner per sheet
 *
 * Exempel input:
 * ```typescript
 * {
 *   "Sheet1": [
 *     { name: "Alice", age: 30 },
 *     { name: "Bob", age: 25 }
 *   ],
 *   "Sheet2": [
 *     { product: "Apple", price: 1.50 },
 *     { product: "Banana", price: 0.75 }
 *   ]
 * }
 * ```
 *
 * Exempel output:
 * ```typescript
 * {
 *   "Sheet1": [
 *     { field: "name", editable: true, flex: 1, sortable: true, filter: true },
 *     { field: "age", editable: true, flex: 1, sortable: true, filter: true }
 *   ],
 *   "Sheet2": [
 *     { field: "product", editable: true, flex: 1, sortable: true, filter: true },
 *     { field: "price", editable: true, flex: 1, sortable: true, filter: true }
 *   ]
 * }
 * ```
 */
function useSheetColumns(sheets: SheetData) {
  /**
   * columns: Memoized kolumndefinitioner
   *
   * useMemo: Beräknas endast när sheets ändras
   * - Detta undviker onödiga beräkningar vid re-renders
   * - Viktig optimering eftersom getColumnDefs kan vara dyr för stora datasets
   *
   * Process:
   * 1. Skapa tomt newColumns-objekt
   * 2. Iterera över alla sheets med Object.entries
   * 3. För varje sheet:
   *    - sheetName: Namnet på sheetet (t.ex. "Sheet1")
   *    - data: Array av rader för sheetet
   *    - Anropa getColumnDefs(data) för att generera kolumndefinitioner
   *    - Type assertion till ExportColumn<ExcelRow>[] (AG Grid's ColDef är kompatibel)
   *    - Spara i newColumns med sheetName som nyckel
   * 4. Returnera newColumns
   *
   * getColumnDefs (från @utils):
   * - Tar array av rader
   * - Extraherar kolumn-namn från första radens keys
   * - Skapar en ColDef för varje kolumn med:
   *   - field: Kolumnnamn
   *   - editable: true (tillåt redigering)
   *   - flex: 1 (flexibel bredd)
   *   - sortable: true (tillåt sortering)
   *   - filter: true (tillåt filtrering)
   *
   * Dependencies: [sheets]
   * - Beräknas om endast när sheets-objektet ändras
   * - Vid ny fil-uppladdning
   * - Vid ändringar i sheets (men vi sparar inte kolumner, så detta är sällsynt)
   */
  const columns = useMemo(() => {
    // Objekt för att lagra kolumndefinitioner per sheet
    const newColumns: Record<string, ExportColumn<ExcelRow>[]> = {};

    /**
     * Object.entries iteration:
     * - Konverterar objekt till array av [key, value] tuples
     * - Gör det enkelt att iterera över alla sheets
     *
     * För varje sheet:
     * - sheetName: String (namnet på sheetet)
     * - data: ExcelRow[] (raddata för sheetet)
     */
    Object.entries(sheets).forEach(([sheetName, data]) => {
      /**
       * Generera kolumndefinitioner för detta sheet:
       *
       * getColumnDefs(data):
       * - Tar array av rader
       * - Returnerar ColDef[] (AG Grid type)
       *
       * Type assertion:
       * - as ExportColumn<ExcelRow>[]
       * - ExportColumn är vår egen type (kan vara alias för ColDef)
       * - Säkerställer type-safety för export-funktionalitet
       */
      newColumns[sheetName] = getColumnDefs(data) as ExportColumn<ExcelRow>[];
    });

    // Returnera det färdiga columns-objektet
    return newColumns;
  }, [sheets]); // Re-compute endast när sheets ändras

  // Returnera memoized columns
  return columns;
}

export default useSheetColumns;
