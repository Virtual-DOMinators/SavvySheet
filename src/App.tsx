import { useState } from 'react';
import { EditableTable } from '@components/table';
import { Header } from '@components/layout';
import { UploadFile } from '@components/upload';
import { ExportButton } from '@components/export';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { ExcelRow, SheetData } from '@types';

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
            <ExportButton
              data={sheetNames.flatMap((sheetName) =>
                sheets[sheetName].map((row) => ({ SheetName: sheetName, ...row })),
              )}
              columns={Object.values(columns).flat()}
              originalFileName={filename}
            />

            <div className="pt-2">
              <h2 className="text-xl font-bold mb-2">{sheetNames[currentSheetIdx]}</h2>
              <EditableTable
                data={sheets[sheetNames[currentSheetIdx]]}
                dataOnChange={(newData) =>
                  setSheets((prev) => ({
                    ...prev,
                    [sheetNames[currentSheetIdx]]: newData as ExcelRow[],
                  }))
                }
              />
              {sheetNames.length > 1 && (
                <div className="flex gap-4 justify-center mt-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentSheetIdx === 0}
                    className="btn btn-outline"
                  >
                    Föregående
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentSheetIdx === sheetNames.length - 1}
                    className="btn btn-outline"
                  >
                    Nästa
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
