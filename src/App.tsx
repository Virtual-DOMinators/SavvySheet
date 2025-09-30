import { useState } from 'react';
import { Header } from '@components/layout';
import { UploadFile } from '@components/upload';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { ExcelRow, SheetData } from '@types';
import { ExportToolbar } from '@components/export';
import { SheetView, SheetNavigation } from '@components/table';

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
      <main className="w-full max-w-3xl mx-auto px-2 md:px-8">
        <UploadFile onDataParsed={handleDataParsed} />
        {sheetNames.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Ingen fil uppladdad ännu.</div>
        ) : (
          <>
            <ExportToolbar
              sheets={sheets}
              columns={Object.values(columns).flat()}
              filename={filename}
            />
            <SheetView
              sheetName={sheetNames[currentSheetIdx]}
              data={sheets[sheetNames[currentSheetIdx]]}
              onDataChange={(newData) =>
                setSheets((prev) => ({
                  ...prev,
                  [sheetNames[currentSheetIdx]]: newData as ExcelRow[],
                }))
              }
            />
            {sheetNames.length > 1 && (
              <SheetNavigation
                currentIdx={currentSheetIdx}
                maxIdx={sheetNames.length - 1}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
