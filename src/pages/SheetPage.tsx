import React from 'react';
import { Header } from '@components/Layout';
import { ExportPanel } from '@components/Export';
import { SheetView } from '@components/Sheet';
import { SheetNavigation } from '@components/Sheet';
import { Spinner } from '@components/Ui';
import type { ExcelRow, SheetData, ExportColumn } from '@types';

interface SheetPageProps {
  sheets: SheetData;
  columns: Record<string, ExportColumn<ExcelRow>[]>;
  filename?: string;
  currentSheetIdx: number;
  setSheets: (sheets: SheetData) => void;
  setCurrentSheetIdx: (idx: number) => void;
}

const SheetPage: React.FC<SheetPageProps> = ({
  sheets,
  columns,
  filename,
  currentSheetIdx,
  setSheets,
  setCurrentSheetIdx,
}) => {
  const sheetNames = Object.keys(sheets);

  const handleNext = () => setCurrentSheetIdx(Math.min(currentSheetIdx + 1, sheetNames.length - 1));
  const handlePrev = () => setCurrentSheetIdx(Math.max(currentSheetIdx - 1, 0));

  if (sheetNames.length === 0) {
    return <div className="text-center text-gray-500">Ingen fil uppladdad ännu.</div>;
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-2 md:px-8 mb-2 flex flex-col">
        <ExportPanel sheets={sheets} columns={Object.values(columns).flat()} filename={filename} />
        <React.Suspense fallback={<Spinner />}>
          <SheetView
            sheetName={sheetNames[currentSheetIdx]}
            data={sheets[sheetNames[currentSheetIdx]]}
            onDataChange={(newData: ExcelRow[]) =>
              setSheets({
                ...sheets,
                [sheetNames[currentSheetIdx]]: newData as ExcelRow[],
              })
            }
            columns={columns[sheetNames[currentSheetIdx]]}
            originalFileName={filename}
          />
        </React.Suspense>
        {sheetNames.length > 1 && (
          <div className="flex justify-center">
            <React.Suspense fallback={<Spinner />}>
              <SheetNavigation
                currentIdx={currentSheetIdx}
                maxIdx={sheetNames.length - 1}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </React.Suspense>
          </div>
        )}
      </div>
    </>
  );
};

export default SheetPage;
