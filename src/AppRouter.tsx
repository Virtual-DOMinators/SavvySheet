import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from '@components/Ui';
import { HomePage, SheetPage } from '@pages';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { SheetData } from '@types';

function AppRouter() {
  const [sheets, setSheets] = useState<SheetData>({});
  const [filename, setFilename] = useState<string | undefined>();
  useLocalSheet(sheets, setSheets, filename, setFilename);

  const columns = useSheetColumns(sheets);
  const [currentSheetIdx, setCurrentSheetIdx] = useState(0);

  const handleDataParsed = (parsedSheets: SheetData, fileName: string) => {
    setSheets(parsedSheets);
    setFilename(fileName);
    setCurrentSheetIdx(0);
  };

  return (
    <BrowserRouter>
      <main className="w-full max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<HomePage onDataParsed={handleDataParsed} />} />
          <Route
            path="/sheet"
            element={
              <React.Suspense fallback={<Spinner />}>
                <SheetPage
                  sheets={sheets}
                  columns={columns}
                  filename={filename}
                  currentSheetIdx={currentSheetIdx}
                  setSheets={setSheets}
                  setCurrentSheetIdx={setCurrentSheetIdx}
                />
              </React.Suspense>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default AppRouter;
