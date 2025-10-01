import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@components/Layout';
import { ExportPanel } from '@components/Export';
import { Spinner } from '@components/Ui';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { ExcelRow, SheetData } from '@types';

const UploadFile = React.lazy(() => import('components/Upload/UploadFile'));
const SheetView = React.lazy(() => import('components/Sheet/SheetView'));
const SheetNavigation = React.lazy(() => import('components/Sheet/SheetNavigation'));

function AppRouter() {
  const [sheets, setSheets] = useState<SheetData>({});
  const [filename, setFilename] = useState<string | undefined>();
  useLocalSheet(sheets, setSheets, filename, setFilename);

  const columns = useSheetColumns(sheets);

  const sheetNames = Object.keys(sheets);
  const [currentSheetIdx, setCurrentSheetIdx] = useState(0);

  const handleNext = () => setCurrentSheetIdx((i) => Math.min(i + 1, sheetNames.length - 1));
  const handlePrev = () => setCurrentSheetIdx((i) => Math.max(i - 1, 0));

  const handleDataParsed = (parsedSheets: SheetData, fileName: string) => {
    setSheets(parsedSheets);
    setFilename(fileName);
    setCurrentSheetIdx(0);
  };

  return (
    <BrowserRouter>
      <Header />
      <main className="w-full max-w-3xl mx-auto">
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<UploadFile onDataParsed={handleDataParsed} />} />
            <Route
              path="/sheet"
              element={
                sheetNames.length === 0 ? (
                  <div className="text-center text-gray-500">Ingen fil uppladdad ännu.</div>
                ) : (
                  <div className="max-w-6xl mx-auto px-2 md:px-8 mb-2 flex flex-col">
                    <ExportPanel
                      sheets={sheets}
                      columns={Object.values(columns).flat()}
                      filename={filename}
                    />
                    <Suspense fallback={<Spinner />}>
                      <SheetView
                        sheetName={sheetNames[currentSheetIdx]}
                        data={sheets[sheetNames[currentSheetIdx]]}
                        onDataChange={(newData: ExcelRow[]) =>
                          setSheets((prev) => ({
                            ...prev,
                            [sheetNames[currentSheetIdx]]: newData as ExcelRow[],
                          }))
                        }
                        columns={columns[sheetNames[currentSheetIdx]]}
                        originalFileName={filename}
                      />
                    </Suspense>
                    {sheetNames.length > 1 && (
                      <div className="flex justify-center">
                        <Suspense fallback={<Spinner />}>
                          <SheetNavigation
                            currentIdx={currentSheetIdx}
                            maxIdx={sheetNames.length - 1}
                            onPrev={handlePrev}
                            onNext={handleNext}
                          />
                        </Suspense>
                      </div>
                    )}
                  </div>
                )
              }
            />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default AppRouter;
