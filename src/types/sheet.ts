import type { ExcelRow } from '@types';

export interface EditableTableProps {
  data: ExcelRow[];
  dataOnChange?: (newData: ExcelRow[]) => void;
}

export type SheetColumn = {
  field: string;
  headerName?: string;
};
