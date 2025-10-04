/**
 * ExportButton.tsx - Komponent för PDF export-knappar
 *
 * Detta är en generisk komponent som visar två knappar för PDF-export:
 * 1. Ladda ner PDF direkt till disk
 * 2. Visa PDF i ny flik för förhandsgranskning
 *
 * Används i:
 * - DropDown-komponenten för att exportera sheets-data
 *
 * Generic Type:
 * - T extends Record<string, unknown> & { SheetName?: string }
 * - Detta betyder att data kan vara vilken object-typ som helst,
 *   men måste ha optional SheetName-property för PDF-gruppering
 *
 * Props:
 * - data: Array av rader att exportera (används inte direkt i denna komponent)
 * - columns: Kolumndefinitioner (används inte direkt i denna komponent)
 * - originalFileName: Filnamn (används inte direkt i denna komponent)
 * - onDownload: Callback för download-knappen
 * - onShow: Callback för preview-knappen
 *
 * Note: Data, columns och originalFileName tas emot men används av parent-komponenten
 * för att generera PDF:en i callback-funktionerna
 */

import { DocumentArrowDownIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ExportColumn } from '@types';

/**
 * ExportButtonProps - Interface för ExportButton-komponentens props
 *
 * Generic Type Parameter:
 * @template T - Type av data-objekt, måste vara Record med optional SheetName
 *
 * @property {T[]} data - Array av rader att exportera
 * @property {ExportColumn<T>[]} columns - Kolumndefinitioner för tabellstruktur
 * @property {string} originalFileName - Filnamn för exported fil (optional)
 * @property {Function} onDownload - Callback som anropas vid klick på download-knappen
 * @property {Function} onShow - Callback som anropas vid klick på preview-knappen
 */
interface ExportButtonProps<T extends Record<string, unknown> & { SheetName?: string }> {
  data: T[];
  columns: ExportColumn<T>[];
  originalFileName?: string;
  onDownload: () => void;
  onShow: () => void;
}

/**
 * ExportButton - Generisk komponent för export-knappar
 *
 * Funktionalitet:
 * - Visar två knappar vertikalt stackade
 * - Download-knapp: Laddar ner PDF direkt
 * - Preview-knapp: Öppnar PDF i ny flik
 *
 * @template T - Type av data-objekt
 * @param {ExportButtonProps<T>} props - Props med callbacks och data
 * @returns {JSX.Element} Två export-knappar
 *
 * Note: Destrukturerar endast onDownload och onShow från props.
 * data, columns och originalFileName behövs inte här eftersom PDF-genereringen
 * sker i parent-komponenten (DropDown) och passeras via callbacks.
 */
function ExportButton<T extends Record<string, unknown> & { SheetName?: string }>({
  onDownload,
  onShow,
}: ExportButtonProps<T>) {
  return (
    /**
     * Container: Vertikal stack av knappar
     *
     * Classes:
     * - export-section: Custom class för styling av child SVG:er (från index.css)
     * - flex flex-col: Vertikal flex-layout
     * - gap-2: Space mellan knapparna
     */
    <div className="export-section flex flex-col gap-2">
      {/**
       * Download-knapp: Ladda ner PDF direkt till användarens dator
       *
       * Props:
       * - type="button": Förhindrar form submission
       * - onClick: Trigger onDownload callback
       * - className: DaisyUI button classes
       *   - btn: Base button styling
       *   - btn-outline: Outline variant (transparent med border)
       *   - btn-primary: Primary färgschema
       *
       * Content:
       * - DocumentArrowDownIcon: Download-ikon från Heroicons
       * - Text: "Ladda ner PDF"
       *
       * Funktionalitet (i parent):
       * - Generera PDF från sheets-data
       * - Spara med .save() metoden
       * - Filnamn: {original}-savvysheet.pdf
       */}
      <button type="button" onClick={onDownload} className="btn btn-outline btn-primary">
        <DocumentArrowDownIcon />
        Ladda ner PDF
      </button>

      {/**
       * Preview-knapp: Öppna PDF i ny flik för förhandsgranskning
       *
       * Props:
       * - type="button": Förhindrar form submission
       * - onClick: Trigger onShow callback
       * - className: DaisyUI button classes
       *   - btn-secondary: Secondary färgschema (skillnad från download)
       *
       * Content:
       * - DocumentMagnifyingGlassIcon: Förstoringsglas-ikon från Heroicons
       * - Text: "Visa PDF"
       *
       * Funktionalitet (i parent):
       * - Generera PDF från sheets-data
       * - Skapa blob URL
       * - Öppna i ny flik med window.open
       * - Användaren kan granska, skriva ut eller ladda ner från browser
       */}
      <button type="button" onClick={onShow} className="btn btn-outline btn-secondary">
        <DocumentMagnifyingGlassIcon />
        Visa PDF
      </button>
    </div>
  );
}

export default ExportButton;
