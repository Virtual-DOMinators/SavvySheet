import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, SheetPage } from '@pages';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { SheetData } from '@types';

function AppRouter() {
  const [sheets, setSheets] = useState<SheetData>({});
  const [filename, setFilename] = useState<string>();
  useLocalSheet(sheets, setSheets, filename, setFilename);

  const columns = useSheetColumns(sheets);
  const [currentSheetIdx, setCurrentSheetIdx] = useState<number>(0);

  // Typad callback för HomePage
  const handleDataParsed = (parsedSheets: SheetData, fileName: string) => {
    setSheets(parsedSheets);
    setFilename(fileName);
    setCurrentSheetIdx(0);
  };

  return (
    <BrowserRouter basename="/SavvySheet">
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage onDataParsed={handleDataParsed} />} />
          <Route
            path="/sheet"
            element={
              <SheetPage
                sheets={sheets}
                columns={columns}
                filename={filename}
                currentSheetIdx={currentSheetIdx}
                setSheets={setSheets}
                setCurrentSheetIdx={setCurrentSheetIdx}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default AppRouter;
