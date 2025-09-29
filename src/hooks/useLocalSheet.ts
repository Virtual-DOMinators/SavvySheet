import { useEffect, useRef } from 'react';

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
      try {
        setSheetData(JSON.parse(saved));
      } catch {
        // Ignorera korrupt JSON
      }
    }
    if (setFilename) {
      const savedFilename = localStorage.getItem(filenameKey);
      if (savedFilename) setFilename(savedFilename);
    }
    hasLoaded.current = true;
    // ESLint: dependencies är stabila, inga funktionsprops inlines!
  }, [key, filenameKey, setSheetData, setFilename]);

  // Spara till localStorage när data eller filnamn ändras, men INTE första render
  useEffect(() => {
    if (!hasLoaded.current) return;
    // Spara ENDAST om datan INTE är tom!
    const isEmpty =
      (Array.isArray(sheetData) && sheetData.length === 0) ||
      (sheetData && typeof sheetData === 'object' && Object.keys(sheetData).length === 0);
    if (isEmpty) return;
    localStorage.setItem(key, JSON.stringify(sheetData));
    if (filename) localStorage.setItem(filenameKey, filename);
  }, [sheetData, filename, key, filenameKey]);
}

export default useLocalSheet;
