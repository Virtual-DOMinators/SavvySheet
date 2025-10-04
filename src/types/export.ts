/**
 * export.ts - TypeScript type definitions för export-funktionalitet
 *
 * Dessa typer används för PDF-export och kolumndefinitioner.
 *
 * Typer:
 * - ExportColumn: Kolumndefinition för export
 *
 * Detta är en förenklad version av AG Grid's ColDef för export-ändamål.
 */

/**
 * ExportColumn - Interface för kolumndefinitioner vid export
 *
 * Detta är en generisk interface för att definiera kolumner vid PDF-export.
 *
 * @template T - Type av data-objekt (måste vara ett object)
 *
 * Properties:
 *
 * field (required):
 * - Anger vilket fält från data-objektet som kolumnen visar
 * - Måste vara en giltig key från T (keyof T)
 * - Type-safety: Förhindrar typos i kolumnnamn
 *
 * headerName (optional):
 * - Custom rubrik för kolumnen
 * - Om saknas: använd field-namnet
 * - Användbart för att göra headers mer läsbara
 *
 * Exempel:
 * ```typescript
 * type Person = {
 *   firstName: string;
 *   lastName: string;
 *   age: number;
 * };
 *
 * const columns: ExportColumn<Person>[] = [
 *   { field: 'firstName', headerName: 'First Name' },
 *   { field: 'lastName', headerName: 'Last Name' },
 *   { field: 'age' }  // headerName saknas, använder 'age'
 * ];
 * ```
 *
 * Generic constraint:
 * - T extends object: T måste vara ett objekt-type
 * - Detta säkerställer att keyof T är meningsfullt
 * - Förhindrar primitive types (string, number, etc.)
 *
 * keyof T:
 * - Ger union type av alla keys i T
 * - Exempel: keyof Person = 'firstName' | 'lastName' | 'age'
 * - Type-safe: Kan inte använda felaktiga fältnamn
 *
 * Relation till AG Grid:
 * - Denna interface är kompatibel med AG Grid's ColDef
 * - AG Grid's ColDef har många fler properties:
 *   - editable, sortable, filter, flex, width, etc.
 * - Vi använder en subset för export-funktionalitet
 * - Type assertion används när vi konverterar:
 *   getColumnDefs(data) as ExportColumn<ExcelRow>[]
 *
 * Användning:
 * - DropDown: Passar columns till ExportButton
 * - ExportButton: Props type för kolumner
 * - generatePDF: Parameter type för kolumner
 * - useSheetColumns: Return type för kolumndefinitioner
 *
 * Note:
 * - I nuvarande implementation används inte columns direkt i generatePDF
 * - Men typen finns för framtida anpassningar:
 *   - Custom column widths
 *   - Custom formatting per kolumn
 *   - Selektiv export (endast vissa kolumner)
 *   - Custom column ordering
 */
export interface ExportColumn<T extends object> {
  field: keyof T;
  headerName?: string;
}
