/**
 * useLocalSheet.ts - Custom React Hook för localStorage-persistens av sheet-data
 *
 * Detta är en kritisk hook för SavvySheet's användarupplevelse.
 * Den säkerställer att användarens data inte förloras vid siduppdatering.
 *
 * Funktionalitet:
 * - Ladda data från localStorage vid initial mount
 * - Spara data till localStorage när den ändras
 * - Debouncing (200ms) för att undvika för många write-operationer
 * - Hantera både sheet-data och filnamn
 * - Type-safe med generics
 *
 * Användarscenario:
 * 1. Användaren laddar upp en fil och redigerar data
 * 2. Data sparas automatiskt till localStorage (varje ändring)
 * 3. Användaren stänger browser-tab av misstag
 * 4. Vid nästa besök laddas datan automatiskt från localStorage
 * 5. Användaren kan fortsätta där de slutade
 *
 * Tekniska detaljer:
 * - Använder två localStorage keys: en för data, en för filnamn
 * - hasLoaded ref förhindrar save på första render (när data laddas)
 * - Debounce (200ms) reducerar antal write-operationer
 * - Skippar sparning av tom data för att undvika onödiga writes
 *
 * Generic Type:
 * - T extends Record<string, unknown> | unknown[]
 * - Kan hantera både objekt (SheetData) och arrays
 * - Flexibel för olika data-strukturer
 */

import { useEffect, useRef } from 'react';

/**
 * useLocalSheet - Custom hook för localStorage-synkronisering
 *
 * @template T - Type av data (objekt eller array)
 * @param {T} sheetData - Aktuell sheet-data att spara
 * @param {Function} setSheetData - State setter för att uppdatera data
 * @param {string} filename - Namnet på filen (optional)
 * @param {Function} setFilename - State setter för filnamn (optional)
 * @param {string} key - localStorage key för data (default: 'savvySheetData')
 * @param {string} filenameKey - localStorage key för filnamn (default: 'savvySheetFilename')
 *
 * Usage exempel:
 * ```typescript
 * const [sheets, setSheets] = useState<SheetData>({});
 * const [filename, setFilename] = useState<string>();
 * useLocalSheet(sheets, setSheets, filename, setFilename);
 * ```
 *
 * Efter detta:
 * - sheets laddas från localStorage vid mount (om finns)
 * - sheets sparas automatiskt vid ändringar
 * - filename synkroniseras på samma sätt
 */
function useLocalSheet<T extends Record<string, unknown> | unknown[]>(
  sheetData: T,
  setSheetData: (d: T) => void,
  filename?: string,
  setFilename?: (f: string) => void,
  key = 'savvySheetData',
  filenameKey = 'savvySheetFilename',
) {
  /**
   * hasLoaded: Ref för att tracka om initial load har skett
   *
   * Purpose:
   * - Förhindra save-effekten att köra på första render
   * - På första render vill vi LADDA från localStorage, inte spara
   * - Efter första load sätts till true, och save-effekten aktiveras
   *
   * Initial value: false
   *
   * Lifecycle:
   * 1. Mount: hasLoaded = false
   * 2. Load effect körs, sätter data från localStorage
   * 3. Load effect sätter hasLoaded = true
   * 4. Save effect börjar köra (men skippas om data är tom)
   * 5. Vid data-ändringar sparas till localStorage
   */
  const hasLoaded = useRef(false);

  /**
   * Effect 1: Load från localStorage vid mount
   *
   * Körs endast en gång vid component mount (tom dependency array).
   *
   * Process:
   * 1. Hämta sparad data från localStorage med given key
   * 2. Om data finns:
   *    - Parsa JSON-strängen till objekt/array
   *    - Uppdatera state med setSheetData
   *    - Error handling om JSON är korrupt
   * 3. Om setFilename finns:
   *    - Hämta sparat filnamn från localStorage
   *    - Uppdatera state med setFilename
   * 4. Sätt hasLoaded till true för att aktivera save-effekten
   *
   * Error handling:
   * - try/catch runt JSON.parse
   * - console.error om parsing misslyckas
   * - State uppdateras inte vid fel (behåller default)
   *
   * Dependencies: [key, filenameKey, setSheetData, setFilename]
   * - key och filenameKey: Om dessa ändras, ladda om från localStorage
   * - setSheetData och setFilename: Stabila funktioner från useState
   */
  useEffect(() => {
    // Hämta sparad data från localStorage
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        // Parsa JSON-sträng till type T
        const parsed: T = JSON.parse(saved);

        // Uppdatera state med parsed data
        setSheetData(parsed);
      } catch (e) {
        // Logga fel om JSON är korrupt
        console.error('Failed to parse saved sheets', e);
        // State förblir oförändrad (default value används)
      }
    }

    // Ladda filnamn om setter finns
    if (setFilename) {
      const savedFilename = localStorage.getItem(filenameKey);
      if (savedFilename) setFilename(savedFilename);
    }

    // Markera att initial load är klar
    hasLoaded.current = true;
  }, [key, filenameKey, setSheetData, setFilename]);

  /**
   * Effect 2: Spara till localStorage vid data-ändringar
   *
   * Körs varje gång sheetData eller filename ändras.
   *
   * Guards:
   * 1. Om hasLoaded är false, returnera early
   *    - Detta förhindrar save vid initial load
   * 2. Om data är tom, returnera early
   *    - Undvik att spara tom data
   *    - isEmpty check hanterar både arrays och objekt
   *
   * Process:
   * 1. Definiera save-funktion
   *    - Serialisera sheetData till JSON-sträng
   *    - Spara till localStorage med given key
   *    - Om filename finns, spara även det
   * 2. Sätt upp timeout (200ms debounce)
   *    - Detta grupperar snabba ändringar
   *    - Reducerar antal write-operationer
   * 3. Returnera cleanup-funktion
   *    - Rensa timeout om component unmountas eller dependencies ändras
   *    - Förhindrar memory leaks
   *
   * Debouncing-effekt:
   * - Användaren redigerar cell A
   * - Timeout startas (200ms)
   * - Användaren redigerar cell B (inom 200ms)
   * - Föregående timeout rensas
   * - Ny timeout startas (200ms)
   * - Efter 200ms utan ändringar: Data sparas
   * - Resultat: En write-operation istället för två
   *
   * Dependencies: [sheetData, filename, key, filenameKey]
   * - sheetData: Spara när data ändras
   * - filename: Spara när filnamn ändras
   * - key och filenameKey: Om keys ändras, spara till nya keys
   */
  useEffect(() => {
    // Early return: Vänta tills initial load är klar
    if (!hasLoaded.current) return;

    /**
     * isEmpty check: Avgör om data är tom
     *
     * För arrays:
     * - Array.isArray(sheetData) && sheetData.length === 0
     *
     * För objekt:
     * - !Array.isArray(sheetData) && Object.keys(sheetData).length === 0
     *
     * Om tom:
     * - Skippa save (undvik att spara tom data)
     * - Detta händer vid initial state innan fil laddas upp
     */
    const isEmpty =
      (Array.isArray(sheetData) && sheetData.length === 0) ||
      (!Array.isArray(sheetData) && Object.keys(sheetData).length === 0);

    // Early return: Skippa save av tom data
    if (isEmpty) return;

    /**
     * save-funktion: Sparar data till localStorage
     *
     * Process:
     * 1. Serialisera sheetData till JSON-sträng
     * 2. Spara till localStorage med key
     * 3. Om filename finns, spara även det
     *
     * localStorage.setItem:
     * - Synkron operation
     * - Skriver till disk (persistent)
     * - Överlevr page reloads och browser-restarts
     */
    const save = () => {
      localStorage.setItem(key, JSON.stringify(sheetData));
      if (filename) localStorage.setItem(filenameKey, filename);
    };

    /**
     * Debounce med setTimeout:
     *
     * - 200ms delay innan save körs
     * - Om komponenten re-renderas inom 200ms, rensas timeout
     * - Ny timeout sätts upp med ny data
     * - Detta grupperar snabba ändringar till en save-operation
     */
    const timeout = setTimeout(save, 200);

    /**
     * Cleanup-funktion:
     *
     * Returneras från effect och körs:
     * - När dependencies ändras (innan nästa effect körs)
     * - När komponenten unmountas
     *
     * Rensar pending timeout för att:
     * - Förhindra save med gammal data
     * - Undvika memory leaks
     */
    return () => clearTimeout(timeout);
  }, [sheetData, filename, key, filenameKey]);
}

export default useLocalSheet;
