import { useMemo } from 'react';
import type { ExportColumn, ExcelRow, SheetData } from '@types';
import { getColumnDefs } from '@utils';

function useSheetColumns(sheets: SheetData) {
  const columns = useMemo(() => {
    const newColumns: Record<string, ExportColumn<ExcelRow>[]> = {};
    Object.entries(sheets).forEach(([sheetName, data]) => {
      newColumns[sheetName] = getColumnDefs(data) as ExportColumn<ExcelRow>[];
    });
    return newColumns;
  }, [sheets]);

  return columns;
}
export default useSheetColumns;
