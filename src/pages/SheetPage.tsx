import React, { useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import type { ExcelRow, SheetData, ExportColumn } from '@types';
import { useLocalSheet } from '@hooks';

interface SheetPageProps {
  sheets: SheetData;
  columns: Record<string, ExportColumn<ExcelRow>[]>;
  filename?: string;
  currentSheetIdx: number;
  setSheets: React.Dispatch<React.SetStateAction<SheetData>>;
  setCurrentSheetIdx: (idx: number) => void;
  setFilename?: (f: string) => void;
}

const Header = React.lazy(() => import('@components/Layout/Header'));
const SheetView = React.lazy(() => import('@components/Sheet/SheetView'));
const SheetNavigation = React.lazy(() => import('@components/Sheet/SheetNavigation'));

const Spinner: React.FC = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-70 z-50">
    <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-400 border-cyan-600 rounded-full animate-spin" />
  </div>
);

const SheetPage: React.FC<SheetPageProps> = ({
  sheets,
  columns,
  filename,
  currentSheetIdx,
  setSheets,
  setCurrentSheetIdx,
  setFilename,
}) => {
  useLocalSheet(sheets, setSheets, filename, setFilename);
  const sheetNames = useMemo(() => Object.keys(sheets), [sheets]);
  const flatColumns = useMemo(() => Object.values(columns).flat(), [columns]);

  const handleNext = () => setCurrentSheetIdx(Math.min(currentSheetIdx + 1, sheetNames.length - 1));
  const handlePrev = () => setCurrentSheetIdx(Math.max(currentSheetIdx - 1, 0));

  if (sheetNames.length === 0) {
    return (
      <Suspense fallback={<Spinner />}>
        <Header sheets={sheets} columns={flatColumns} filename={filename} />
        <div className="text-center text-gray-500 mt-12">Ingen fil uppladdad ännu.</div>
      </Suspense>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      <Suspense fallback={<Spinner />}>
        <Header sheets={sheets} columns={flatColumns} filename={filename} />
        <div className="flex flex-col gap-4 p-2 lg:pl-10 lg:pr-10">
          <SheetView
            sheetName={sheetNames[currentSheetIdx]}
            data={sheets[sheetNames[currentSheetIdx]]}
            columns={columns[sheetNames[currentSheetIdx]]}
            originalFileName={filename}
            onDataChange={(newData: ExcelRow[]) =>
              setSheets((prev) => ({
                ...prev,
                [sheetNames[currentSheetIdx]]: newData,
              }))
            }
          />
          {sheetNames.length > 1 && (
            <div className="">
              <SheetNavigation
                currentIdx={currentSheetIdx}
                maxIdx={sheetNames.length - 1}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          )}
        </div>
      </Suspense>
    </motion.div>
  );
};

export default SheetPage;
