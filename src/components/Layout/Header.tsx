/**
 * Header.tsx - Huvudnavigering och header för SavvySheet
 *
 * Detta är den fasta headern som visas överst på alla sidor.
 *
 * Funktioner:
 * - Visa SavvySheet logotyp och titel
 * - Export-funktionalitet via DropDown-meny (när data finns)
 * - Navigation tillbaka till startsidan
 *
 * Props:
 * - sheets: All sheet-data (behövs för export)
 * - columns: Kolumndefinitioner (behövs för PDF-generering)
 * - filename: Filnamn (används för att namnge exported filer)
 *
 * Conditional rendering:
 * - DropDown visas endast när det finns data (hasData === true)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropDown } from '@components/Layout';
import type { SheetData, ExcelRow, ExportColumn } from '@types';

/**
 * HeaderProps - Interface för Header-komponentens props
 *
 * @property {SheetData} sheets - Objekt med alla sheets och deras data
 * @property {ExportColumn<ExcelRow>[]} columns - Kolumndefinitioner för export
 * @property {string} filename - Namnet på den uppladdade filen (optional)
 */
interface HeaderProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
}

/**
 * Header - Huvudkomponent för header/navigation
 *
 * @param {HeaderProps} props - Props med sheets, columns och filename
 * @returns {JSX.Element} Renderad header med logo, titel och optional dropdown
 */
const Header: React.FC<HeaderProps> = ({ sheets, columns, filename }) => {
  /**
   * navigate: React Router hook för programmatisk navigering
   * Används för att navigera tillbaka till startsidan (/) vid klick på "Ladda upp ny fil"
   */
  const navigate = useNavigate();

  /**
   * hasData: Boolean som indikerar om det finns uppladdad data
   *
   * Logik: Kollar om sheets-objektet har några nycklar
   * - true: Det finns minst ett sheet med data
   * - false: Tomt objekt, ingen data uppladdad
   *
   * Används för conditional rendering av DropDown
   */
  const hasData = Object.keys(sheets).length > 0;

  /**
   * handleNewFile - Callback för att ladda upp ny fil
   *
   * Funktionalitet:
   * - Navigerar till startsidan (/)
   * - Användaren kan då ladda upp en ny fil
   * - localStorage kommer behålla gammal data tills ny fil laddas upp
   */
  const handleNewFile = () => {
    navigate('/');
  };

  return (
    /**
     * Header element: Flexbox layout för logo och meny
     *
     * Styling:
     * - flex justify-between: Logo till vänster, meny till höger
     * - items-center: Vertikal centrering
     * - border-b-3: Bottom border för separation
     * - p-3: Padding runt innehållet
     */
    <header className="flex justify-between items-center border-b-3 p-3">
      {/**
       * Logo och titel-sektion: Vänster sida av header
       *
       * Layout:
       * - flex items-center: Horisontell layout med vertikal centrering
       * - gap-4: Space mellan logo och titel
       * - p-4: Padding runt sektionen
       */}
      <div className="flex items-center gap-4 p-4">
        {/**
         * Logo: WebP-bild från public-mappen
         *
         * Props:
         * - src="logo.webp": Relativ path (Vite hanterar detta)
         * - alt="Logo": Accessibility text
         * - className: Fast storlek 12x12 (48px x 48px)
         */}
        <img src="logo.webp" alt="Logo" className="h-12 w-12" />

        {/**
         * Titel: SavvySheet varumärkestext
         *
         * Styling:
         * - text-3xl: Stor font size
         * - font-bold: Fet text
         * - font-grand-hotel: Custom cursive font från Google Fonts
         */}
        <h1 className="text-3xl font-bold font-grand-hotel">SavvySheet</h1>
      </div>

      {/**
       * Meny-sektion: Höger sida av header
       *
       * Layout:
       * - flex items-center: Horisontell layout med vertikal centrering
       * - gap-4: Space mellan eventuella element
       * - p-2: Mindre padding än logo-sektionen
       */}
      <div className="flex items-center gap-4 p-2">
        {/**
         * DropDown: Conditional rendering baserat på hasData
         *
         * Visas endast när det finns uppladdad data.
         *
         * Props:
         * - sheets: All data (för export-funktionalitet)
         * - columns: Kolumndefinitioner (för PDF-tabeller)
         * - filename: Används för att namnge exported filer
         * - onUploadNewFile: Callback för "Ladda upp ny fil"-knappen
         *
         * Funktionalitet i DropDown:
         * - Visa/dölja dropdown-meny vid klick
         * - Export till PDF (download eller preview)
         * - Ladda upp ny fil (navigera till /)
         */}
        {hasData && (
          <DropDown
            sheets={sheets}
            columns={columns}
            filename={filename}
            onUploadNewFile={handleNewFile}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
