/**
 * exportUtils.ts - Utility-funktioner för PDF-export
 *
 * Detta är ansvaret för att generera PDF-filer från sheet-data.
 *
 * Funktioner:
 * - getPdfFilename: Generera PDF-filnamn från original filnamn
 * - generatePDF: Skapa PDF-dokument med jsPDF och autoTable
 *
 * Dependencies:
 * - jsPDF: PDF-generering library
 * - jspdf-autotable: Plugin för att skapa tabeller i PDF
 *
 * PDF-struktur:
 * - En sida per sheet
 * - Sheet-namn som rubrik
 * - Tabell med alla rader och kolumner
 * - Auto-formattering av datatypes
 *
 * Användning:
 * - DropDown-komponenten använder dessa funktioner
 * - Download: doc.save(filename)
 * - Preview: window.open(doc.output('bloburl'))
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportColumn } from '@types';

/**
 * getPdfFilename - Generera PDF-filnamn från original Excel-filnamn
 *
 * Transformering:
 * - "myfile.xlsx" -> "myfile-savvysheet.pdf"
 * - "document.xls" -> "document-savvysheet.pdf"
 * - undefined -> "table-savvysheet.pdf"
 * - "noextension" -> "noextension-savvysheet.pdf"
 *
 * @param {string} originalFileName - Namnet på den uppladdade Excel-filen (optional)
 * @returns {string} PDF-filnamn med "-savvysheet.pdf" suffix
 *
 * Process:
 * 1. Om inget filnamn finns, returnera default
 * 2. Hitta sista punkten i filnamnet (för att ta bort extension)
 * 3. Extrahera basename (allt före punkten)
 * 4. Lägg till "-savvysheet.pdf"
 *
 * Edge cases:
 * - Filnamn utan extension: Hela namnet används som basename
 * - Multipla punkter: Endast sista extraheras (t.ex. "my.file.xlsx" -> "my.file")
 * - Tom sträng: Returnerar "-savvysheet.pdf" (edge case, osannolikt)
 */
export function getPdfFilename(originalFileName?: string): string {
  // Guard: Om inget filnamn, använd default
  if (!originalFileName) return 'table-savvysheet.pdf';

  /**
   * lastIndexOf('.'): Hitta sista punktens position
   *
   * Returnerar:
   * - Index av sista punkten (0-baserat)
   * - -1 om ingen punkt finns
   *
   * Exempel:
   * - "myfile.xlsx" -> 6
   * - "my.file.xlsx" -> 7
   * - "noextension" -> -1
   */
  const dotIndex = originalFileName.lastIndexOf('.');

  /**
   * basename: Filnamn utan extension
   *
   * Conditional:
   * - Om dotIndex > 0: Ta substring från början till punkten
   * - Annars: Använd hela filnamnet
   *
   * dotIndex > 0 (inte >= 0):
   * - Hanterar edge case där filnamnet börjar med punkt (t.ex. ".hiddenfile")
   * - I detta fall använder vi hela filnamnet
   *
   * Exempel:
   * - "myfile.xlsx", dotIndex=6 -> basename="myfile"
   * - "noextension", dotIndex=-1 -> basename="noextension"
   * - ".hidden", dotIndex=0 -> basename=".hidden"
   */
  const basename = dotIndex > 0 ? originalFileName.substring(0, dotIndex) : originalFileName;

  // Returnera basename med SavvySheet suffix
  return `${basename}-savvysheet.pdf`;
}

/**
 * generatePDF - Generera PDF-dokument från sheet-data
 *
 * Detta är huvudfunktionen för PDF-export. Den skapar en PDF med:
 * - En sida per sheet
 * - Sheet-namn som rubrik
 * - Tabell med alla rader och kolumner
 * - Auto-formattering av olika datatypes
 *
 * @template T - Type av data-objekt, måste innehålla optional SheetName
 * @param {T[]} data - Flat array av alla rader med SheetName-metadata
 *   Exempel: [
 *     { SheetName: "Sheet1", col1: "val1", col2: "val2" },
 *     { SheetName: "Sheet1", col1: "val3", col2: "val4" },
 *     { SheetName: "Sheet2", col1: "val5", col2: "val6" }
 *   ]
 * @param {ExportColumn<T>[]} _columns - Kolumndefinitioner (används inte i denna implementation)
 * @returns {jsPDF} jsPDF instance med genererad PDF
 *
 * Process:
 * 1. Skapa jsPDF instance
 * 2. Gruppera data per sheet
 * 3. För varje sheet:
 *    a. Lägg till ny sida (efter första)
 *    b. Skriv sheet-namn som rubrik
 *    c. Extrahera kolumnnamn från första raden
 *    d. Formattera rad-data
 *    e. Skapa tabell med autoTable
 * 4. Returnera färdig PDF
 *
 * Note: _columns parameter används inte här, men finns för framtida
 * anpassningar (t.ex. anpassad kolumnformatering)
 */
export function generatePDF<T extends Record<string, unknown> & { SheetName?: string }>(
  data: T[],
  _columns: ExportColumn<T>[],
) {
  /**
   * jsPDF instance: Skapar ett nytt PDF-dokument
   *
   * Default settings:
   * - Orientation: Portrait (stående)
   * - Unit: Millimeters
   * - Format: A4
   *
   * Instance methods:
   * - addPage(): Lägg till ny sida
   * - setFontSize(): Sätt font-storlek
   * - text(): Skriv text
   * - save(): Spara PDF till disk
   * - output(): Generera blob eller data URL
   */
  const doc = new jsPDF();

  /**
   * grouped: Gruppera data per sheet
   *
   * Structure: { [sheetName: string]: T[] }
   *
   * Process:
   * 1. Skapa tomt objekt
   * 2. Iterera över all data
   * 3. För varje rad:
   *    - Extrahera SheetName (eller använd "Sheet" som default)
   *    - Om grupp inte finns, skapa tom array
   *    - Lägg till rad i gruppen
   *
   * Resultat:
   * {
   *   "Sheet1": [
   *     { SheetName: "Sheet1", col1: "val1", col2: "val2" },
   *     { SheetName: "Sheet1", col1: "val3", col2: "val4" }
   *   ],
   *   "Sheet2": [
   *     { SheetName: "Sheet2", col1: "val5", col2: "val6" }
   *   ]
   * }
   */
  const grouped: Record<string, T[]> = {};

  data.forEach((row) => {
    // Extrahera sheet-namn eller använd default "Sheet"
    const sheet = row.SheetName || 'Sheet';

    // Initiera array om sheet inte finns
    if (!grouped[sheet]) grouped[sheet] = [];

    // Lägg till rad i rätt grupp
    grouped[sheet].push(row);
  });

  /**
   * first: Flag för att tracka första sheet
   *
   * Purpose:
   * - Första sheet renderas på första sidan (som redan finns)
   * - Efterföljande sheets behöver nya sidor (addPage)
   * - Detta undviker tom första sida
   *
   * Initial: true
   * Efter första sheet: false
   */
  let first = true;

  /**
   * Iterera över alla sheets och generera PDF-sidor
   *
   * Object.entries: Konverterar grouped till [sheetName, rows] tuples
   *
   * För varje sheet:
   * 1. Lägg till ny sida (om inte första)
   * 2. Sätt font-storlek för rubrik
   * 3. Skriv sheet-namn som rubrik
   * 4. Extrahera kolumnnamn
   * 5. Formattera rad-data
   * 6. Skapa tabell med autoTable
   */
  Object.entries(grouped).forEach(([sheet, rows]) => {
    /**
     * Sidhantering: Lägg till ny sida för varje sheet (utom första)
     *
     * if (!first): Om inte första sheet
     * - doc.addPage(): Skapa ny tom sida
     *
     * first = false: Markera att första sheet är hanterad
     */
    if (!first) doc.addPage();
    first = false;

    /**
     * Rubrik: Skriv sheet-namn överst på sidan
     *
     * setFontSize(14): Sätt större font för rubrik
     * text(text, x, y): Skriv text på position
     * - text: `${sheet}` (sheet-namnet)
     * - x: 14mm från vänster
     * - y: 20mm från toppen
     */
    doc.setFontSize(14);
    doc.text(`${sheet}`, 14, 20);

    /**
     * sheetCols: Extrahera kolumnnamn från första raden
     *
     * Process:
     * 1. Hämta keys från första raden (rows[0])
     * 2. Filtrera bort "SheetName" (metadata, ska inte visas i tabell)
     *
     * rows[0] || {}:
     * - Använd första raden om finns
     * - Annars tomt objekt (för tom sheets)
     *
     * Exempel:
     * Input: { SheetName: "Sheet1", Name: "Alice", Age: 30 }
     * Output: ["Name", "Age"]
     */
    const sheetCols = Object.keys(rows[0] || {}).filter((k) => k !== 'SheetName');

    /**
     * head: Table header för autoTable
     *
     * Format: [[col1, col2, col3, ...]]
     * - Outer array: Kan ha multipla header-rader (vi har bara en)
     * - Inner array: Kolumnnamn
     *
     * Exempel: [["Name", "Age", "City"]]
     */
    const head = [sheetCols];

    /**
     * body: Table body data för autoTable
     *
     * Format: [[val1, val2, val3], [val4, val5, val6], ...]
     * - Varje inner array är en rad
     * - Values i samma ordning som headers
     *
     * Process:
     * 1. Map över alla rader
     * 2. För varje rad, map över kolumner
     * 3. För varje cell, extrahera och formattera värdet
     *
     * Formattering:
     * - boolean: true -> "Yes", false -> "No"
     * - number/string: Använd as-is
     * - null/undefined: Tom sträng
     * - Annat: Konvertera till string
     *
     * Exempel transformation:
     * Input row: { Name: "Alice", Age: 30, Active: true }
     * Columns: ["Name", "Age", "Active"]
     * Output: ["Alice", 30, "Yes"]
     */
    const body: (string | number)[][] = rows.map((row) =>
      sheetCols.map((col) => {
        // Extrahera cell-värde
        const value = row[col as keyof typeof row];

        // Formattera baserat på type
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number' || typeof value === 'string') return value;
        if (value === null || value === undefined) return '';
        return String(value);
      }),
    );

    /**
     * autoTable: Generera tabell i PDF:en
     *
     * autoTable är en plugin för jsPDF som skapar formaterade tabeller.
     *
     * Parameters:
     * - doc: jsPDF instance att rita på
     * - options:
     *   - head: Header-rader för tabellen
     *   - body: Data-rader för tabellen
     *   - startY: Y-position där tabellen ska börja (30mm från toppen)
     *     - 20mm för rubrik + 10mm mellanrum
     *
     * autoTable hanterar automatiskt:
     * - Column widths (baserat på innehåll)
     * - Text wrapping (om text är för lång)
     * - Page breaks (om tabellen inte får plats på en sida)
     * - Cell padding och borders
     * - Header styling (bold, bakgrundsfärg)
     *
     * Output: Tabellen ritas direkt på PDF-dokumentet
     */
    autoTable(doc, { head, body, startY: 30 });
  });

  /**
   * Returnera färdig PDF
   *
   * jsPDF instance kan användas för:
   * - doc.save(filename): Ladda ner till disk
   * - doc.output('bloburl'): Generera blob URL för preview
   * - doc.output('datauristring'): Generera data URI
   * - doc.output('arraybuffer'): Generera ArrayBuffer för vidare processing
   */
  return doc;
}
