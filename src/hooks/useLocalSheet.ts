import { useEffect, useRef } from 'react';

/**
 * Custom hook för att spara och ladda sheets-data till localStorage.
 * Hanterar både array och objekt-format samt filnamn.
 *
 * @param sheetData      - Datan som ska sparas (array eller objekt)
 * @param setSheetData   - Setter för datan
 * @param filename       - Filnamn (valfritt)
 * @param setFilename    - Setter för filnamn (valfritt)
 * @param key            - LocalStorage-nyckel för datan
 * @param filenameKey    - LocalStorage-nyckel för filnamn
 */
function useLocalSheet<T>(
  sheetData: T,
  setSheetData: (d: T) => void,
  filename?: string,
  setFilename?: (f: string) => void,
  key = 'savvySheetData',
  filenameKey = 'savvySheetFilename',
) {
  const hasLoaded = useRef(false);

  // Läs från localStorage EN gång vid mount
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      setSheetData(JSON.parse(saved));
    }
    if (setFilename) {
      const savedFilename = localStorage.getItem(filenameKey);
      if (savedFilename) setFilename(savedFilename);
    }
    hasLoaded.current = true;
  }, [key, filenameKey, setSheetData, setFilename]);

  // Spara till localStorage när data eller filnamn ändras, men INTE första render
  useEffect(() => {
    if (!hasLoaded.current) return;

    // Om det är en array och den är tom → spara inte
    if (Array.isArray(sheetData) && sheetData.length === 0) return;

    // Om det är ett objekt och det är tomt → spara inte
    if (
      !Array.isArray(sheetData) &&
      typeof sheetData === 'object' &&
      Object.keys(sheetData as object).length === 0
    ) {
      return;
    }

    localStorage.setItem(key, JSON.stringify(sheetData));
    if (filename) localStorage.setItem(filenameKey, filename);
  }, [sheetData, filename, key, filenameKey]);
}

export default useLocalSheet;
