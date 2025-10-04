/**
 * UploadFile.tsx - Komponent för filuppladdning via drag-and-drop eller filväljare
 *
 * Detta är den huvudsakliga komponenten för att ladda upp Excel-filer (.xlsx).
 *
 * Funktioner:
 * - Drag-and-drop: Dra filer till upload-området
 * - Klick: Öppna filväljare vid klick
 * - Validering: Kontrollera att filen är .xlsx
 * - Parsing: Läs och parsa Excel-filen med xlsx-biblioteket
 * - Loading state: Visar spinner under parsing
 * - Error handling: Visar felmeddelanden vid problem
 *
 * Användarflöde:
 * 1. Användaren drar en fil eller klickar på området
 * 2. Filvalidering kontrollerar .xlsx-format
 * 3. Loading state aktiveras
 * 4. Filen parsas asynkront med parseExcelFile
 * 5. onDataParsed anropas med parsed data
 * 6. Automatisk navigering till /sheet
 */

import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@components/Ui';
import type { UploadFileProps } from '@types';

/**
 * UploadFile - Huvudkomponent för filuppladdning
 *
 * @param {UploadFileProps} props - Props med onDataParsed callback
 * @returns {JSX.Element} Upload-område med drag-and-drop support
 */
const UploadFile: React.FC<UploadFileProps> = ({ onDataParsed }) => {
  /**
   * fileInputRef: Ref till den dolda file input-elementet
   * Används för att trigga filväljaren programmatiskt vid klick på div:en
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * loading: State för att visa/dölja spinner under parsing
   * true: Visar spinner
   * false: Visar upload-text/instruktioner
   */
  const [loading, setLoading] = useState(false);

  /**
   * isDragging: State för att tracka när användaren drar en fil över området
   * Används för att ändra styling (glow-effekt, border-färg)
   */
  const [isDragging, setIsDragging] = useState(false);

  /**
   * navigate: React Router hook för programmatisk navigering
   * Används för att gå till /sheet efter lyckad uppladdning
   */
  const navigate = useNavigate();

  /**
   * handleFile - Huvudfunktion för att processa uppladdade filer
   *
   * @param {File} file - Den valda/droppade filen
   *
   * Flöde:
   * 1. Validera att filen är .xlsx
   * 2. Sätt loading state
   * 3. Dynamiskt importera parseExcelFile (code splitting)
   * 4. Parsa filen och anropa onDataParsed callback
   * 5. Navigera till /sheet
   * 6. Hantera fel och visa alert
   * 7. Återställ loading state
   *
   * useCallback: Memoized för att undvika onödiga re-renders
   * Dependencies: onDataParsed och navigate
   */
  const handleFile = useCallback(
    async (file: File) => {
      // Validering: Kontrollera filformat
      if (!file.name.endsWith('.xlsx')) {
        alert('Endast .xlsx-filer stöds.');
        return;
      }

      // Aktivera loading state för att visa spinner
      setLoading(true);

      try {
        // Dynamisk import av parseExcelFile för code splitting
        // Detta reducerar initial bundle size
        const { parseExcelFile } = await import('utils/uploadUtils');

        // Parsa Excel-filen och anropa callback med resultatet
        // parseExcelFile läser filen och omvandlar till SheetData-format
        await parseExcelFile(file, onDataParsed);

        // Navigera till /sheet för att visa det uppladdade datat
        navigate('/sheet');
      } catch (error) {
        // Logga fel för debugging
        console.error('Fel vid parsing av Excel-fil:', error);

        // Visa användarvänligt felmeddelande
        alert('Kunde inte läsa filen. Kontrollera att det är en giltig .xlsx-fil.');
      } finally {
        // Återställ loading state oavsett om parsing lyckades eller inte
        setLoading(false);
      }
    },
    [onDataParsed, navigate],
  );

  /**
   * handleFileChange - Event handler för file input change
   *
   * Triggas när användaren väljer en fil via filväljaren
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Change event från input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Hämta första filen från input (files kan vara null)
    const file = event.target.files?.[0];

    // Om fil finns, processa den
    if (file) {
      handleFile(file);
    }
  };

  /**
   * handleDrop - Event handler för drop event (drag-and-drop)
   *
   * Triggas när användaren släpper en fil över området
   *
   * @param {React.DragEvent<HTMLDivElement>} event - Drop event
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    // Förhindra default browser-beteende (öppna fil i ny tab)
    event.preventDefault();

    // Återställ dragging state (tar bort hover-effekt)
    setIsDragging(false);

    // Hämta första filen från dataTransfer
    const file = event.dataTransfer.files?.[0];

    // Om fil finns, processa den
    if (file) {
      handleFile(file);
    }
  };

  /**
   * handleDragOver - Event handler för dragover event
   *
   * Triggas kontinuerligt när användaren drar något över området
   *
   * @param {React.DragEvent<HTMLDivElement>} event - Dragover event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // Förhindra default beteende för att tillåta drop
    event.preventDefault();

    // Aktivera dragging state (visar hover-effekt)
    setIsDragging(true);
  };

  /**
   * handleDragLeave - Event handler för dragleave event
   *
   * Triggas när användaren drar bort från området
   */
  const handleDragLeave = () => {
    // Återställ dragging state (tar bort hover-effekt)
    setIsDragging(false);
  };

  return (
    /**
     * Outer wrapper: Container med responsiv bredd och spacing
     * - my-6: Vertikal margin
     * - w-screen max-w-3xl: Full bredd upp till 3xl breakpoint
     * - mx-auto: Centrera horisontellt
     * - px-2 md:px-8: Responsiv horizontal padding
     */
    <div className="my-6 w-screen max-w-3xl mx-auto px-2 md:px-8">
      {/**
       * Upload-område: Klickbar och draggable yta för filuppladdning
       *
       * Styling:
       * - Dynamic classes baserat på isDragging state
       * - Animerad gradient-bakgrund vid hover/drag
       * - Glow-effekt (shadow) vid dragging
       * - Smooth transitions (duration-500)
       *
       * Event handlers:
       * - onClick: Trigga filväljare
       * - onDrop: Hantera dropped filer
       * - onDragOver: Tracka drag-state
       * - onDragLeave: Återställ drag-state
       */}
      <div
        className={`w-full h-full text-center cursor-pointer transition-all duration-500 rounded-xl border
          flex items-center justify-center min-h-[60px]
          ${
            isDragging
              ? 'border-blue-400 animated-gradient-bg shadow-[0_0_40px_10px_rgba(0,255,255,0.2)]'
              : 'border-gray-400 bg-white/5 hover:animated-gradient-bg hover:shadow-[0_0_30px_5px_rgba(0,255,255,0.07)]'
          }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/**
         * Conditional rendering: Visar antingen spinner eller instruktionstext
         *
         * loading === true: Visar Spinner-komponent under parsing
         * loading === false: Visar text med instruktioner
         *
         * Text ändras baserat på isDragging:
         * - Dragging: "Släpp filen här."
         * - Normal: "Importera en .xlsx-fil"
         */}
        {loading ? (
          <Spinner />
        ) : (
          <p className="text-gray-500">
            {isDragging ? 'Släpp filen här.' : 'Importera en .xlsx-fil'}
          </p>
        )}
      </div>

      {/**
       * Hidden file input: Dold input som triggas via ref
       *
       * Props:
       * - ref: fileInputRef för programmatisk access
       * - type="file": Fil-input
       * - accept=".xlsx": Begränsar till endast .xlsx-filer
       * - onChange: Triggas när fil väljs
       * - className="hidden": Gömd visuellt
       *
       * Detta pattern ger oss kontroll över UI:et samtidigt som
       * vi använder native file picker-funktionalitet
       */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default UploadFile;
