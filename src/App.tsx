import React, { useState, Suspense } from 'react';
import { Header } from '@components/Layout';
import { ExportPanel } from '@components/Export';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { ExcelRow, SheetData } from '@types';
import { Spinner } from '@components/Ui';

const UploadFile = React.lazy(() => import('components/Upload/UploadFile'));
const SheetView = React.lazy(() => import('components/Sheet/SheetView'));
const SheetNavigation = React.lazy(() => import('components/Sheet/SheetNavigation'));

function App() {
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
    <div>
      <Header />
      <main className="w-full max-w-3xl mx-auto px-2 md:px-8 mb-2">
        <Suspense fallback={<Spinner />}>
          <UploadFile onDataParsed={handleDataParsed} />
        </Suspense>

        {sheetNames.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Ingen fil uppladdad ännu.</div>
        ) : (
          <>
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
              <Suspense fallback={<Spinner />}>
                <SheetNavigation
                  currentIdx={currentSheetIdx}
                  maxIdx={sheetNames.length - 1}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </Suspense>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
