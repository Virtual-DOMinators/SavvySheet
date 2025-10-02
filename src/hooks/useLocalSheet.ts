import { useEffect, useRef } from 'react';

/**
 * Custom hook för att spara och ladda sheets-data till localStorage.
 * @template T - Typ av sheet-data, kan vara objekt eller array.
 */
function useLocalSheet<T extends Record<string, unknown> | unknown[]>(
  sheetData: T,
  setSheetData: (d: T) => void,
  filename?: string,
  setFilename?: (f: string) => void,
  key = 'savvySheetData',
  filenameKey = 'savvySheetFilename',
) {
  const hasLoaded = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: T = JSON.parse(saved);
        setSheetData(parsed);
      } catch (e) {
        console.error('Failed to parse saved sheets', e);
      }
    }

    if (setFilename) {
      const savedFilename = localStorage.getItem(filenameKey);
      if (savedFilename) setFilename(savedFilename);
    }

    hasLoaded.current = true;
  }, [key, filenameKey, setSheetData, setFilename]);

  useEffect(() => {
    if (!hasLoaded.current) return;

    const isEmpty =
      (Array.isArray(sheetData) && sheetData.length === 0) ||
      (!Array.isArray(sheetData) && Object.keys(sheetData).length === 0);

    if (isEmpty) return;

    const save = () => {
      localStorage.setItem(key, JSON.stringify(sheetData));
      if (filename) localStorage.setItem(filenameKey, filename);
    };

    const timeout = setTimeout(save, 200);
    return () => clearTimeout(timeout);
  }, [sheetData, filename, key, filenameKey]);
}

export default useLocalSheet;
