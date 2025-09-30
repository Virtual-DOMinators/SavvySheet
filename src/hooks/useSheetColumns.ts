import { useEffect, useState } from 'react';
import type { ExportColumn } from '@components/export';
import type { ExcelRow, SheetData } from '@types';
import { getColumnDefs } from '@components/table';

export function useSheetColumns(sheets: SheetData) {
  const [columns, setColumns] = useState<{ [sheetName: string]: ExportColumn<ExcelRow>[] }>({});

  useEffect(() => {
    const newColumns: { [sheetName: string]: ExportColumn<ExcelRow>[] } = {};
    Object.entries(sheets).forEach(([sheetName, data]) => {
      newColumns[sheetName] = getColumnDefs(data) as ExportColumn<ExcelRow>[];
    });
    setColumns(newColumns);
  }, [sheets]);

  return columns;
}
