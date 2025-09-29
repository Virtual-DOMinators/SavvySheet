import { useEffect, useRef } from 'react';

function useLocalSheet<T>(
  sheetData: T[],
  setSheetData: (d: T[]) => void,
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
    // Spara ENDAST om datan INTE är tom!
    if (!hasLoaded.current) return;
    // Om datan är tom array och vi har laddat klart: spara inte
    if (Array.isArray(sheetData) && sheetData.length === 0) return;
    localStorage.setItem(key, JSON.stringify(sheetData));
    if (filename) localStorage.setItem(filenameKey, filename);
  }, [sheetData, filename, key, filenameKey]);
}

export default useLocalSheet;
