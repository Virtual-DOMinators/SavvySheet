/**
 * uploadUtils.ts - Utility-funktioner för att hantera Excel-filuppladdning
 *
 * Detta är ansvaret för att läsa och parsa Excel-filer (.xlsx).
 *
 * Funktioner:
 * - parseExcelFile: Läs och parsa en Excel-fil till JavaScript-objekt
 *
 * Dependencies:
 * - xlsx: SheetJS library för att läsa Excel-filer
 * - FileReader: Browser API för att läsa filer
 *
 * Dataflöde:
 * 1. Användaren väljer .xlsx-fil
 * 2. parseExcelFile tar emot File-objektet
 * 3. FileReader läser filen som ArrayBuffer
 * 4. xlsx library parsar ArrayBuffer till Workbook
 * 5. Varje sheet konverteras till JSON
 * 6. Callback anropas med parsed data
 *
 * Supported format:
 * - .xlsx (Excel 2007+)
 * - Multipla sheets stöds
 * - Alla datatypes: string, number, boolean, date
 */

import * as XLSX from 'xlsx';
import type { RowData } from '@types';

/**
 * parseExcelFile - Läs och parsa en Excel-fil
 *
 * Detta är en asynkron operation (via FileReader) som:
 * 1. Läser filen som ArrayBuffer
 * 2. Parsar med xlsx library
 * 3. Konverterar varje sheet till JSON
 * 4. Anropar callback med resultatet
 *
 * @param {File} file - File-objekt från input eller drag-and-drop
 * @param {Function} onDataParsed - Callback som anropas när parsing är klar
 *   @param {Object} data - Objekt med sheet-namn som nycklar och row-arrays som värden
 *     Exempel: { "Sheet1": [{col1: "val1"}, ...], "Sheet2": [...] }
 *   @param {string} fileName - Namnet på den uppladdade filen
 *
 * Process:
 * 1. Skapa FileReader instance
 * 2. Definiera onload-handler som körs när fil är läst
 * 3. Starta läsning av fil som ArrayBuffer
 * 4. När läst: Parsa med xlsx och anropa callback
 *
 * FileReader onload:
 * - Triggas när readAsArrayBuffer är klar
 * - event.target.result innehåller ArrayBuffer med fil-data
 *
 * xlsx.read:
 * - Parsar ArrayBuffer till Workbook-objekt
 * - Workbook innehåller:
 *   - SheetNames: Array av sheet-namn
 *   - Sheets: Objekt med sheet-data
 *
 * xlsx.utils.sheet_to_json:
 * - Konverterar sheet till array av objekt
 * - Varje rad blir ett objekt med kolumnnamn som keys
 * - defval: '': Tom sträng för tomma celler (default undefined)
 *
 * Exempel:
 * Input Excel (Sheet1):
 * | Name  | Age |
 * |-------|-----|
 * | Alice | 30  |
 * | Bob   | 25  |
 *
 * Output JSON:
 * {
 *   "Sheet1": [
 *     { "Name": "Alice", "Age": 30 },
 *     { "Name": "Bob", "Age": 25 }
 *   ]
 * }
 */
export function parseExcelFile(
  file: File,
  onDataParsed: (data: { [sheetName: string]: RowData[] }, fileName: string) => void,
) {
  /**
   * FileReader: Browser API för att läsa filer
   *
   * Skapar en ny instance som kan:
   * - Läsa filer som text, ArrayBuffer, eller Data URL
   * - Trigga events när läsningen är klar
   * - Hantera progress och errors
   */
  const reader = new FileReader();

  /**
   * onload handler: Anropas när fil-läsningen är komplett
   *
   * @param {ProgressEvent} event - Event-objekt från FileReader
   *
   * event.target.result:
   * - Innehåller det lästa innehållet
   * - Type: ArrayBuffer (binary data)
   * - Detta är raw Excel-fil data
   */
  reader.onload = (event) => {
    /**
     * Konvertera ArrayBuffer till Uint8Array
     *
     * Uint8Array:
     * - Typed array för 8-bit unsigned integers
     * - xlsx library förväntar sig detta format
     * - Type assertion: event.target?.result as ArrayBuffer
     *   - event.target kan vara null (men är inte det här)
     *   - result är ArrayBuffer i vårt fall
     */
    const data = new Uint8Array(event.target?.result as ArrayBuffer);

    /**
     * XLSX.read: Parsa binary data till Workbook
     *
     * @param {Uint8Array} data - Binary fil-data
     * @param {Object} options - Parse-options
     *   - type: 'array': Indikerar att input är Uint8Array
     *
     * Returnerar Workbook-objekt med:
     * - SheetNames: string[] - Array av sheet-namn
     * - Sheets: { [name: string]: WorkSheet } - Objekt med sheet-data
     * - Props: Metadata om workbook
     */
    const workbook = XLSX.read(data, { type: 'array' });

    /**
     * allSheets: Objekt för att samla all parsed data
     *
     * Structure: { [sheetName: string]: RowData[] }
     *
     * Exempel:
     * {
     *   "Sheet1": [{ col1: "val1", col2: "val2" }, ...],
     *   "Sheet2": [{ col1: "val3", col2: "val4" }, ...],
     * }
     */
    const allSheets: { [sheetName: string]: RowData[] } = {};

    /**
     * Iterera över alla sheets i workbook
     *
     * workbook.SheetNames: Array av sheet-namn
     * Exempel: ["Sheet1", "Sheet2", "Customers", "Products"]
     *
     * För varje sheet:
     * 1. Hämta WorkSheet-objekt från workbook.Sheets
     * 2. Konvertera till JSON med sheet_to_json
     * 3. Spara i allSheets med sheet-namnet som nyckel
     */
    workbook.SheetNames.forEach((sheetName) => {
      /**
       * worksheet: WorkSheet-objekt för aktuellt sheet
       *
       * WorkSheet:
       * - Internt format från xlsx library
       * - Innehåller cell-data, formler, styling etc.
       * - Måste konverteras till användbart format
       */
      const worksheet = workbook.Sheets[sheetName];

      /**
       * XLSX.utils.sheet_to_json: Konvertera WorkSheet till JSON
       *
       * @param {WorkSheet} worksheet - Sheet att konvertera
       * @param {Object} options - Konverterings-options
       *   - defval: '': Default-värde för tomma celler
       *     - Default är undefined, men vi vill ha tom sträng
       *     - Gör datahantering enklare och mer förutsägbar
       *
       * Returnerar: RowData[] - Array av objekt
       *
       * Varje rad blir ett objekt där:
       * - Keys är kolumnnamn (från första raden i Excel)
       * - Values är cell-värden (string, number, boolean)
       *
       * Exempel transformation:
       * Excel:
       * | Name  | Age |
       * | Alice | 30  |
       * | Bob   |     |  (tom cell)
       *
       * JSON:
       * [
       *   { "Name": "Alice", "Age": 30 },
       *   { "Name": "Bob", "Age": "" }   // tom cell blir tom sträng
       * ]
       */
      const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // Spara parsed data i allSheets
      allSheets[sheetName] = jsonData;
    });

    /**
     * Anropa callback med parsed data och filnamn
     *
     * @param {Object} allSheets - Objekt med alla sheets och deras data
     * @param {string} file.name - Namnet på den uppladdade filen
     *
     * Callback (från UploadFile eller HomePage):
     * 1. Tar emot parsed data
     * 2. Uppdaterar state i AppRouter
     * 3. useLocalSheet sparar till localStorage
     * 4. Navigerar till /sheet för att visa data
     */
    onDataParsed(allSheets, file.name);
  };

  /**
   * Starta fil-läsning som ArrayBuffer
   *
   * readAsArrayBuffer:
   * - Asynkron operation
   * - Läser hela filen till minnet
   * - Triggar onload när klar
   * - Kan trigga onerror vid problem
   *
   * För stora filer:
   * - Detta kan ta tid (visas via loading spinner)
   * - Hela filen laddas till minnet (kan vara problem för multi-GB filer)
   * - Men .xlsx-filer är typiskt små (komprimerade)
   */
  reader.readAsArrayBuffer(file);
}
