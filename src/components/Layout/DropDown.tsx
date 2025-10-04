/**
 * DropDown.tsx - Dropdown-meny för export och filhantering
 *
 * Detta är en dropdown-komponent som innehåller export- och filhanteringsfunktioner.
 *
 * Funktioner:
 * - Toggle dropdown-meny vid klick
 * - Export till PDF (download direkt till disk)
 * - Visa PDF i ny flik för förhandsgranskning
 * - Ladda upp ny fil (navigera tillbaka till startsidan)
 *
 * Props:
 * - sheets: All sheet-data för PDF-generering
 * - columns: Kolumndefinitioner för tabellstruktur i PDF
 * - filename: Används för att namnge PDF-filen
 * - onUploadNewFile: Callback för att ladda upp ny fil
 *
 * State:
 * - open: Boolean för att visa/dölja dropdown-menyn
 */

import { useState } from 'react';
import { ChevronDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import type { SheetData, ExcelRow, ExportColumn } from '@types';
import { getPdfFilename, generatePDF } from '@utils';
import { ExportButton } from '@components/Export';

/**
 * DropDownProps - Interface för DropDown-komponentens props
 *
 * @property {SheetData} sheets - Objekt med alla sheets och deras data
 * @property {ExportColumn<ExcelRow>[]} columns - Kolumndefinitioner för PDF-tabeller
 * @property {string} filename - Namnet på den uppladdade filen (optional)
 * @property {Function} onUploadNewFile - Callback som anropas när användaren vill ladda upp ny fil
 */
interface DropDownProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
  onUploadNewFile: () => void;
}

/**
 * DropDown - Huvudkomponent för dropdown-meny
 *
 * @param {DropDownProps} props - Props med sheets, columns, filename och callbacks
 * @returns {JSX.Element | null} Renderad dropdown eller null om ingen data finns
 */
export default function DropDown({ sheets, columns, filename, onUploadNewFile }: DropDownProps) {
  /**
   * open: State för att tracka om dropdown-menyn är öppen eller stängd
   *
   * - true: Dropdown-menyn visas
   * - false: Dropdown-menyn är dold
   *
   * Toggle:as via klick på huvudknappen
   */
  const [open, setOpen] = useState(false);

  /**
   * Early return: Om ingen data finns, rendera ingenting
   *
   * Detta är en safety check även om komponenten endast renderas när hasData === true
   * i Header-komponenten
   */
  if (!sheets || Object.keys(sheets).length === 0) return null;

  /**
   * sheetNames: Array med alla sheet-namn från sheets-objektet
   * Exempel: ["Sheet1", "Sheet2", "Customers"]
   */
  const sheetNames = Object.keys(sheets);

  /**
   * data: Transformerad data för PDF-export
   *
   * Process:
   * 1. flatMap över alla sheet-namn
   * 2. För varje sheet, map över alla rader
   * 3. Lägg till SheetName-property till varje rad
   * 4. Detta gör att PDF:en kan gruppera data per sheet
   *
   * Resultat: En flat array av alla rader med SheetName-metadata
   * Exempel: [
   *   { SheetName: "Sheet1", col1: "val1", col2: "val2" },
   *   { SheetName: "Sheet1", col1: "val3", col2: "val4" },
   *   { SheetName: "Sheet2", col1: "val5", col2: "val6" }
   * ]
   */
  const data = sheetNames.flatMap((sheetName) =>
    sheets[sheetName].map((row) => ({ SheetName: sheetName, ...row })),
  );

  /**
   * pdfFilename: Genererat PDF-filnamn baserat på original filnamn
   *
   * getPdfFilename transformerar:
   * - "myfile.xlsx" -> "myfile-savvysheet.pdf"
   * - undefined -> "table-savvysheet.pdf"
   */
  const pdfFilename = getPdfFilename(filename);

  /**
   * handleDownload - Ladda ner PDF direkt till disk
   *
   * Process:
   * 1. Generera PDF-dokument med generatePDF
   * 2. Spara till disk med .save() metoden
   * 3. Stäng dropdown-menyn
   *
   * generatePDF skapar:
   * - En PDF med separata sidor för varje sheet
   * - Tabeller med headers och data
   * - Formatting enligt jsPDF och autoTable
   */
  const handleDownload = () => {
    const doc = generatePDF(data, columns);
    doc.save(pdfFilename);
    setOpen(false);
  };

  /**
   * handleShow - Öppna PDF i ny flik för förhandsgranskning
   *
   * Process:
   * 1. Generera PDF-dokument
   * 2. Skapa blob URL från PDF:en
   * 3. Öppna i ny flik med window.open
   * 4. Stäng dropdown-menyn
   *
   * Användare kan:
   * - Granska PDF innan download
   * - Ladda ner från browser om önskat
   * - Skriva ut direkt från preview
   */
  const handleShow = () => {
    const doc = generatePDF(data, columns);
    window.open(doc.output('bloburl'), '_blank');
    setOpen(false);
  };

  /**
   * handleUploadNewFile - Navigera till startsidan för ny filuppladdning
   *
   * Process:
   * 1. Anropa onUploadNewFile callback (navigerar till /)
   * 2. Stäng dropdown-menyn
   */
  const handleUploadNewFile = () => {
    onUploadNewFile();
    setOpen(false);
  };

  return (
    /**
     * Dropdown wrapper: Relativ positionering för absolut dropdown-innehåll
     *
     * relative: Positioneringskontext för dropdown-menyn
     * inline-block: Inline element med block-properties
     * text-left: Text alignment för dropdown-innehåll
     */
    <div className="relative inline-block text-left">
      {/**
       * Dropdown toggle button: Huvudknapp för att öppna/stänga menyn
       *
       * Props:
       * - type="button": Förhindrar form submission om i form
       * - onClick: Toggle open state
       * - className: DaisyUI button classes + custom styling
       * - aria-haspopup: Accessibility - indikerar att knappen öppnar en meny
       * - aria-expanded: Accessibility - indikerar om menyn är öppen
       *
       * Content:
       * - Text: "Meny"
       * - ChevronDownIcon: Ned-pil från Heroicons
       */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-inline btn-secondary inline-flex items-center rounded text-base transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Meny
        {/* Chevron icon: 5x5 med margin-left */}
        <ChevronDownIcon className="ml-2 w-5 h-5" />
      </button>

      {/**
       * Dropdown menu: Conditional rendering baserat på open state
       *
       * Layout:
       * - absolute right-0: Positionerad till höger om toggle-knappen
       * - mt-2: Top margin för spacing från knappen
       * - w-56: Fast bredd
       * - z-30: Högt z-index för att ligga över allt annat
       *
       * Styling:
       * - rounded-md: Rundade hörn
       * - shadow-lg: Stark skugga för djupeffekt
       * - bg-base-100: DaisyUI base bakgrundsfärg
       * - border: Subtil border
       * - py-2 p-2: Padding
       * - flex flex-col gap-2: Vertikal stack med gap
       */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-30 bg-base-100 border border-gray-300 py-2 flex flex-col gap-2 p-2">
          {/**
           * ExportButton-komponent: Innehåller PDF export-funktionalitet
           *
           * Props:
           * - data: Transformed data med SheetName för gruppering
           * - columns: Kolumndefinitioner för tabellstruktur
           * - originalFileName: För metadata
           * - onDownload: Callback för download-knappen
           * - onShow: Callback för preview-knappen
           *
           * Komponenten renderar:
           * - "Ladda ner PDF"-knapp
           * - "Visa PDF"-knapp
           */}
          <ExportButton
            data={data}
            columns={columns}
            originalFileName={pdfFilename}
            onDownload={handleDownload}
            onShow={handleShow}
          />

          {/**
           * Upload new file button: Knapp för att ladda upp ny fil
           *
           * Props:
           * - onClick: Trigger handleUploadNewFile
           * - className: DaisyUI button classes med outline style
           *
           * Content:
           * - ArrowUpTrayIcon: Upload-ikon från Heroicons
           * - Text: "Ladda upp ny fil"
           *
           * Funktionalitet:
           * - Navigerar tillbaka till startsidan
           * - Användaren kan ladda upp en ny fil
           * - Gammal data behålls i localStorage tills ny fil laddas
           */}
          <button
            onClick={handleUploadNewFile}
            className="flex w-full  gap-2 px-4 py-2 hover:bg-gray-100 btn btn-outline"
          >
            {/* Upload icon: 5x5 */}
            <ArrowUpTrayIcon className="w-5 h-5" /> Ladda upp ny fil
          </button>
        </div>
      )}
    </div>
  );
}
