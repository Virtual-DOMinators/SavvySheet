/**
 * upload.ts - TypeScript type definitions för filuppladdning
 *
 * Dessa typer används för filuppladdning och Excel-parsing.
 *
 * Typer:
 * - RowData: En rad från Excel-fil (alias för ExcelRow)
 * - UploadFileProps: Props för UploadFile-komponenten
 *
 * Separata typer för upload-kontext ger bättre separation of concerns.
 */

/**
 * RowData - Representerar en rad från en uppladdad Excel-fil
 *
 * Detta är en index signature type för rad-data från Excel.
 *
 * Structure:
 * - Key: string (kolumnnamn)
 * - Value: string | number | boolean | null
 *
 * Note: Detta är identiskt med ExcelRow från excel.ts
 *
 * Varför separat type?
 * - Separation of concerns: upload-kontext vs. app-kontext
 * - uploadUtils.ts använder RowData
 * - Resten av appen använder ExcelRow
 * - Samma struktur men olika semantisk betydelse
 *
 * Användning:
 * - parseExcelFile: Return type för parsed data
 * - uploadUtils.ts: Intern type för Excel-parsing
 *
 * Framtida consideration:
 * - Kunde alias:a till ExcelRow istället:
 *   export type RowData = ExcelRow;
 * - Men behåller separat definition för flexibilitet
 * - Om upload-logik behöver annan struktur i framtiden
 */
export type RowData = {
  [key: string]: string | number | boolean | null;
};

/**
 * UploadFileProps - Props interface för UploadFile-komponenten
 *
 * Definierar vilka props UploadFile-komponenten förväntar sig.
 *
 * Properties:
 *
 * onDataParsed (required):
 * - Callback-funktion som anropas när fil har parsats
 * - Type: Function med två parametrar
 *
 * Callback parameters:
 *
 * @param {Object} data - Parsed sheet-data
 *   - Structure: { [sheetName: string]: RowData[] }
 *   - Key: Sheet-namn från Excel-fil
 *   - Value: Array av rader för det sheetet
 *   - Exempel: { "Sheet1": [{name: "Alice", age: 30}], "Sheet2": [...] }
 *
 * @param {string} fileName - Namnet på den uppladdade filen
 *   - Exempel: "mydata.xlsx", "customers.xlsx"
 *   - Används för att generera export-filnamn
 *   - Visas i UI för att visa vilken fil som är uppladdad
 *
 * Dataflöde:
 * 1. Användaren väljer fil i UploadFile
 * 2. parseExcelFile läser och parsar filen
 * 3. onDataParsed anropas med parsed data och filnamn
 * 4. Callback (från HomePage) uppdaterar AppRouter state
 * 5. Navigering till /sheet för att visa data
 *
 * Exempel användning:
 * ```typescript
 * const handleDataParsed = (data: { [sheetName: string]: RowData[] }, fileName: string) => {
 *   console.log('File uploaded:', fileName);
 *   console.log('Sheets:', Object.keys(data));
 *   setSheets(data);
 *   setFilename(fileName);
 * };
 *
 * <UploadFile onDataParsed={handleDataParsed} />
 * ```
 *
 * Type-safety:
 * - Säkerställer att callback har rätt signature
 * - Förhindrar att UploadFile används utan callback
 * - IDE kan autocomplete och type-check callback
 *
 * Callback-chaining:
 * - HomePage -> AppRouter -> useLocalSheet -> localStorage
 * - Type-safety genom hela kedjan
 */
export interface UploadFileProps {
  onDataParsed: (data: { [sheetName: string]: RowData[] }, fileName: string) => void;
}
