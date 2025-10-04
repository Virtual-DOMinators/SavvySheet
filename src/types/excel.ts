/**
 * excel.ts - TypeScript type definitions för Excel-data
 *
 * Dessa typer definierar strukturen för Excel-data i SavvySheet.
 *
 * Typer:
 * - ExcelRow: En rad i ett Excel-sheet
 * - SheetData: Samling av alla sheets med deras rader
 *
 * Används genom hela applikationen för type-safety.
 */

/**
 * ExcelRow - Representerar en rad i ett Excel-sheet
 *
 * Detta är en index signature type som tillåter dynamiska properties.
 *
 * Structure:
 * - Key: string (kolumnnamn från Excel)
 * - Value: string | number | boolean | null
 *
 * Exempel:
 * ```typescript
 * const row: ExcelRow = {
 *   "Name": "Alice",
 *   "Age": 30,
 *   "Active": true,
 *   "MiddleName": null
 * };
 * ```
 *
 * Tillåtna värdetyper:
 *
 * string:
 * - Text-värden från Excel
 * - Tom sträng för tomma celler
 * - Exempel: "Alice", "Stockholm", ""
 *
 * number:
 * - Numeriska värden från Excel
 * - Heltal och decimaler
 * - Exempel: 30, 42.5, -10
 *
 * boolean:
 * - TRUE/FALSE från Excel
 * - Konverteras till true/false
 * - Exempel: true, false
 *
 * null:
 * - Representerar saknade värden
 * - Används för celler utan data
 * - Skiljer från tom sträng ""
 *
 * Index signature:
 * - [key: string]: Tillåter vilket kolumnnamn som helst
 * - Detta är nödvändigt eftersom vi inte vet kolumnnamn i förväg
 * - Excel-filer kan ha olika kolumner
 * - Flexibelt men fortfarande type-safe
 *
 * Användning:
 * - EditableTable: Rad-data i AG Grid
 * - SheetView: Data för ett specifikt sheet
 * - Export: Data för PDF-generering
 * - localStorage: Serialisering/deserialisering
 */
export type ExcelRow = {
  [key: string]: string | number | boolean | null;
};

/**
 * SheetData - Representerar alla sheets från en Excel-fil
 *
 * Detta är en record type som mappar sheet-namn till arrays av rader.
 *
 * Structure:
 * - Key: string (sheet-namn från Excel)
 * - Value: ExcelRow[] (array av rader för det sheetet)
 *
 * Exempel:
 * ```typescript
 * const sheets: SheetData = {
 *   "Sheet1": [
 *     { "Name": "Alice", "Age": 30 },
 *     { "Name": "Bob", "Age": 25 }
 *   ],
 *   "Customers": [
 *     { "Company": "ACME", "Contact": "John Doe" },
 *     { "Company": "TechCorp", "Contact": "Jane Smith" }
 *   ],
 *   "Products": []  // Tom sheet (inga rader)
 * };
 * ```
 *
 * Index signature:
 * - [sheetName: string]: Tillåter vilket sheet-namn som helst
 * - Excel-filer kan ha olika antal sheets med olika namn
 * - Default namn: "Sheet1", "Sheet2", etc.
 * - Custom namn: Användaren kan döpa om sheets i Excel
 *
 * Value type:
 * - ExcelRow[]: Array av rader
 * - Kan vara tom array (sheet utan data)
 * - Varje rad har samma struktur (samma kolumner)
 * - Men olika sheets kan ha olika kolumner
 *
 * Användning:
 * - AppRouter: Global state för alla sheets
 * - SheetPage: Props till sheet-komponenter
 * - useLocalSheet: Persistens till localStorage
 * - parseExcelFile: Return type från Excel-parsing
 * - Export: Input till PDF-generering
 *
 * State management:
 * - useState<SheetData>: Håller all sheet-data
 * - Uppdateras vid:
 *   - Ny fil uppladdad (ersätter allt)
 *   - Cell redigerad (uppdaterar specifikt sheet)
 *   - Data laddad från localStorage
 *
 * Object operations:
 * - Object.keys(sheets): Få alla sheet-namn
 * - sheets[sheetName]: Få data för specifikt sheet
 * - { ...sheets, [name]: newData }: Uppdatera specifikt sheet
 */
export type SheetData = {
  [sheetName: string]: ExcelRow[];
};
