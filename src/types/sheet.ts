/**
 * sheet.ts - TypeScript type definitions för sheet-komponenter
 *
 * Dessa typer används för sheet-visning och redigering.
 *
 * Typer:
 * - EditableTableProps: Props för EditableTable-komponenten
 * - SheetColumn: Kolumndefinition för sheets
 *
 * Används primärt av Sheet-komponenter (EditableTable, SheetView).
 */

import type { ExcelRow } from '@types';

/**
 * EditableTableProps - Props interface för EditableTable-komponenten
 *
 * Definierar vilka props EditableTable (AG Grid wrapper) förväntar sig.
 *
 * Properties:
 *
 * data (required):
 * - Array av rader att visa i tabellen
 * - Type: ExcelRow[] (array av objekt)
 * - Varje objekt representerar en rad
 * - Keys är kolumnnamn, values är cell-värden
 *
 * Exempel:
 * ```typescript
 * const data: ExcelRow[] = [
 *   { "Name": "Alice", "Age": 30, "City": "Stockholm" },
 *   { "Name": "Bob", "Age": 25, "City": "Göteborg" }
 * ];
 * ```
 *
 * dataOnChange (required):
 * - Callback-funktion som anropas när data ändras
 * - Type: Function med en parameter
 *
 * Callback parameter:
 *
 * @param {ExcelRow[]} newData - Den uppdaterade datan från tabellen
 * - Hela rad-arrayen returneras (inte bara ändringen)
 * - Parent-komponent uppdaterar state med denna data
 * - useLocalSheet sparar automatiskt till localStorage
 *
 * Trigger conditions:
 * - Användaren redigerar en cell och lämnar den (blur)
 * - Användaren lämnar tabell-området med musen (mouseLeave)
 * - onCellValueChanged från AG Grid
 *
 * Dataflöde:
 * 1. Användaren redigerar cell i AG Grid
 * 2. EditableTable's saveData() samlar all grid-data
 * 3. Jämför med lastSavedData (undvik onödiga calls)
 * 4. Anropar dataOnChange med uppdaterad data
 * 5. SheetView propagerar till SheetPage
 * 6. SheetPage uppdaterar sheets state
 * 7. useLocalSheet sparar till localStorage
 *
 * Exempel användning:
 * ```typescript
 * const [tableData, setTableData] = useState<ExcelRow[]>([...]);
 *
 * const handleDataChange = (newData: ExcelRow[]) => {
 *   console.log('Data changed!');
 *   setTableData(newData);
 * };
 *
 * <EditableTable
 *   data={tableData}
 *   dataOnChange={handleDataChange}
 * />
 * ```
 *
 * Type-safety:
 * - Säkerställer rätt prop-types
 * - Förhindrar att data eller callback saknas
 * - IDE autocomplete och type-checking
 */
export interface EditableTableProps {
  data: ExcelRow[];
  dataOnChange: (newData: ExcelRow[]) => void;
}

/**
 * SheetColumn - Kolumndefinition för sheets
 *
 * Detta är en förenklad kolumndefinition.
 *
 * Properties:
 *
 * field (required):
 * - Kolumnens fält-namn
 * - Type: string
 * - Används för att accessa data från rad-objekt
 * - Exempel: "Name", "Age", "Email"
 *
 * headerName (optional):
 * - Custom rubrik för kolumnen
 * - Type: string (optional)
 * - Om saknas: använd field-namnet
 * - Användbart för att göra headers mer läsbara
 *
 * Exempel:
 * ```typescript
 * const column: SheetColumn = {
 *   field: 'firstName',
 *   headerName: 'First Name'
 * };
 * ```
 *
 * Relation till andra types:
 * - Liknande ExportColumn men utan generics
 * - Enklare struktur för grundläggande användning
 * - ExportColumn<T> är mer type-safe med keyof T
 *
 * Användning:
 * - För närvarande inte aktivt använd i koden
 * - Definierad för framtida funktionalitet
 * - Kan användas för:
 *   - Custom column configuration
 *   - Column visibility settings
 *   - Column ordering
 *
 * Note:
 * - I praktiken använder vi AG Grid's ColDef direkt
 * - Eller ExportColumn för export-funktionalitet
 * - SheetColumn kan tas bort om den inte behövs
 * - Eller expanderas med fler properties i framtiden
 */
export type SheetColumn = {
  field: string;
  headerName?: string;
};
