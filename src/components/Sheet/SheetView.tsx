/**
 * SheetView.tsx - Komponent för att visa och redigera ett enskilt sheet
 *
 * Detta är en wrapper-komponent som visar:
 * - Sheet-namn som rubrik
 * - EditableTable med data från sheetet
 *
 * Props:
 * - sheetName: Namnet på sheetet (visas som rubrik)
 * - data: Array av rader för detta sheet
 * - onDataChange: Callback när data ändras i tabellen
 * - columns: Kolumndefinitioner (används inte direkt här, men passeras till EditableTable)
 * - originalFileName: Original filnamn (används inte direkt här)
 *
 * Ansvar:
 * - Enkel layout med rubrik och tabell
 * - Delegerar all redigerings-logik till EditableTable
 * - Propagerar data-ändringar uppåt via onDataChange callback
 */

import { EditableTable } from '@components/Sheet';
import type { ExcelRow, ExportColumn } from '@types';

/**
 * SheetViewProps - Interface för SheetView-komponentens props
 *
 * @property {string} sheetName - Namnet på sheetet som visas
 * @property {ExcelRow[]} data - Array av rader för detta sheet
 * @property {Function} onDataChange - Callback som anropas när data ändras
 *   @param {ExcelRow[]} newData - Den uppdaterade datan från tabellen
 * @property {ExportColumn<ExcelRow>[]} columns - Kolumndefinitioner för tabellen
 * @property {string} originalFileName - Original filnamn (optional, för metadata)
 */
interface SheetViewProps {
  sheetName: string;
  data: ExcelRow[];
  onDataChange: (newData: ExcelRow[]) => void;
  columns: ExportColumn<ExcelRow>[];
  originalFileName?: string;
}

/**
 * SheetView - Komponent för att visa och redigera ett sheet
 *
 * Layout:
 * - H2 rubrik med sheet-namn
 * - EditableTable med all redigerings-funktionalitet
 *
 * @param {SheetViewProps} props - Props med sheetName, data och callbacks
 * @returns {JSX.Element} Renderad sheet-vy
 *
 * Note: columns och originalFileName tas emot men används inte direkt.
 * De kan behövas av EditableTable eller för framtida funktionalitet.
 */
const SheetView: React.FC<SheetViewProps> = ({ sheetName, data, onDataChange }) => {
  return (
    /**
     * Container: Enkel wrapper med padding
     *
     * pt-2: Top padding för spacing från header
     */
    <div className="pt-2">
      {/**
       * Rubrik: Visar sheet-namnet
       *
       * Styling:
       * - text-xl: Stor font size
       * - font-bold: Fet text
       * - mb-2: Bottom margin för spacing från tabellen
       *
       * Content: sheetName (t.ex. "Sheet1", "Customers", etc.)
       */}
      <h2 className="text-xl font-bold mb-2">{sheetName}</h2>

      {/**
       * EditableTable: AG Grid-baserad redigerbar tabell
       *
       * Props:
       * - data: Raddata för tabellen
       * - dataOnChange: Callback när data ändras
       *
       * Funktionalitet (i EditableTable):
       * - Visa data i ett grid-format
       * - Redigera celler inline
       * - Auto-generera kolumner från data
       * - Spara ändringar vid cell blur eller mouse leave
       * - Sortering och filtrering (AG Grid features)
       */}
      <EditableTable data={data} dataOnChange={onDataChange} />
    </div>
  );
};

export default SheetView;
