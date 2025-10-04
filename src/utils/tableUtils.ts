/**
 * tableUtils.ts - Utility-funktioner för tabellhantering
 *
 * Detta är hjälpfunktioner för att arbeta med tabelldata och AG Grid.
 *
 * Funktioner:
 * - isEqual: Deep equality check för arrays
 * - getColumnDefs: Generera AG Grid kolumndefinitioner från data
 *
 * Används av:
 * - EditableTable: För att generera kolumner och jämföra data
 * - useSheetColumns: För att generera kolumner för alla sheets
 */

import type { ColDef } from 'ag-grid-community';

/**
 * isEqual - Deep equality check för arrays
 *
 * Jämför två arrays genom att serialisera till JSON och jämföra strängarna.
 *
 * @param {unknown[]} a - Första arrayen att jämföra
 * @param {unknown[]} b - Andra arrayen att jämföra
 * @returns {boolean} true om arrays är identiska, annars false
 *
 * Metod:
 * - JSON.stringify: Konverterar arrays till JSON-strängar
 * - String comparison: Jämför de två strängarna
 *
 * Fördelar:
 * - Enkel implementation
 * - Deep comparison (nested objekt hanteras)
 * - Fungerar för alla JSON-serialiserbara typer
 *
 * Nackdelar:
 * - Prestanda: Långsam för stora arrays (serialisering är dyr)
 * - Property order: { a: 1, b: 2 } !== { b: 2, a: 1 } (olika ordning)
 * - Special values: undefined, functions, symbols ignoreras av JSON.stringify
 *
 * Användning i EditableTable:
 * - Jämföra updatedData med lastSavedData
 * - Undvika onödiga callback-anrop om data inte ändrats
 * - Optimering för att minska re-renders
 *
 * Exempel:
 * ```typescript
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 * isEqual([{a: 1}], [{a: 1}]) // true
 * isEqual([1, 2], [2, 1]) // false
 * isEqual([{a: 1, b: 2}], [{b: 2, a: 1}]) // false (olika property order)
 * ```
 *
 * Alternativ (för bättre prestanda):
 * - lodash _.isEqual: Deep equality med better edge case handling
 * - fast-deep-equal: Snabbare implementation
 * - Custom shallow comparison: Om bara first-level behöver jämföras
 */
export function isEqual(a: unknown[], b: unknown[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * getColumnDefs - Generera AG Grid kolumndefinitioner från data
 *
 * Extraherar kolumnnamn från första radens keys och skapar AG Grid ColDef-objekt.
 *
 * @param {Record<string, unknown>[]} data - Array av data-rader (objekt)
 * @returns {ColDef[]} Array av AG Grid kolumndefinitioner
 *
 * Process:
 * 1. Guard: Returnera tom array om data saknas eller är tom
 * 2. Extrahera keys från första objektet i array
 * 3. För varje key, skapa ett ColDef-objekt med:
 *    - field: Kolumnnamnet (key)
 *    - editable: true (tillåt inline-redigering)
 *    - flex: 1 (flexibel bredd, delar space jämnt mellan kolumner)
 *    - sortable: true (tillåt sortering via column header)
 *    - filter: true (tillåt filtrering)
 *
 * Guard clause:
 * - Om data är null/undefined: Returnera []
 * - Om data är tom array: Returnera []
 * - Detta förhindrar errors när man försöker accessa data[0]
 *
 * Object.keys(data[0]):
 * - Extraherar alla property names från första objektet
 * - Antar att alla rader har samma struktur
 * - I Excel-context är detta rimligt (alla rader har samma kolumner)
 *
 * ColDef properties:
 *
 * field (required):
 * - Property name i data-objektet
 * - Exempel: "Name", "Age", "Email"
 * - AG Grid använder detta för att hämta cell-värden
 *
 * editable:
 * - Gör celler klickbara för redigering
 * - Dubbel-klick eller Enter aktiverar edit-mode
 * - Escape avbryter, Enter eller Tab sparar
 *
 * flex:
 * - Flexibel kolumnbredd
 * - 1 betyder: Dela tillgängligt space jämnt
 * - Om alla kolumner har flex: 1, får de lika bredd
 * - Alternativ: width (fast bredd i pixels)
 *
 * sortable:
 * - Visa sort-ikoner i column header
 * - Klick för att sortera ascending/descending
 * - Multi-column sort med Shift+Click
 *
 * filter:
 * - Visa filter-ikon i column header
 * - Öppnar filter-meny med olika options
 * - Textfilter för strings
 * - Numeriskt filter för numbers
 * - Datum-filter för dates
 *
 * Andra möjliga ColDef properties (ej använda här):
 * - headerName: Custom header text (default är field)
 * - valueFormatter: Format cell värden för visning
 * - valueParser: Parse användarinput
 * - cellEditor: Custom cell editor
 * - cellRenderer: Custom cell rendering
 * - minWidth, maxWidth: Bredd-constraints
 * - hide: Göm kolumn
 * - pinned: Fäst kolumn till vänster/höger
 *
 * Exempel:
 * ```typescript
 * Input data:
 * [
 *   { Name: "Alice", Age: 30, City: "Stockholm" },
 *   { Name: "Bob", Age: 25, City: "Göteborg" }
 * ]
 *
 * Output ColDef[]:
 * [
 *   { field: "Name", editable: true, flex: 1, sortable: true, filter: true },
 *   { field: "Age", editable: true, flex: 1, sortable: true, filter: true },
 *   { field: "City", editable: true, flex: 1, sortable: true, filter: true }
 * ]
 * ```
 *
 * AG Grid använder sedan dessa ColDef:s för att:
 * - Rendera column headers
 * - Extrahera cell-värden från row data
 * - Hantera user interactions (sort, filter, edit)
 * - Beräkna column widths
 */
export function getColumnDefs(data: Record<string, unknown>[]): ColDef[] {
  // Guard: Returnera tom array om data saknas eller är tom
  if (!data || data.length === 0) return [];

  /**
   * Map över alla keys från första objektet
   *
   * Object.keys(data[0]):
   * - Returnerar array av property names
   * - Exempel: ["Name", "Age", "City"]
   *
   * map((key) => ({ ... })):
   * - Transformera varje key till ett ColDef-objekt
   * - Varje kolumn får samma konfiguration
   * - Konsistent behavior för alla kolumner
   */
  return Object.keys(data[0]).map((key) => ({
    field: key, // Kolumnnamn och data-accessor
    editable: true, // Tillåt inline-redigering
    flex: 1, // Flexibel bredd (dela space jämnt)
    sortable: true, // Tillåt sortering
    filter: true, // Tillåt filtrering
  }));
}
