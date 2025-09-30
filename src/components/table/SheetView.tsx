import { EditableTable } from '@components/table';
import type { ExcelRow } from '@types';

interface SheetViewProps {
  sheetName: string;
  data: ExcelRow[];
  onDataChange: (newData: ExcelRow[]) => void;
}

export function SheetView({ sheetName, data, onDataChange }: SheetViewProps) {
  return (
    <div className="pt-2">
      <h2 className="text-xl font-bold mb-2">{sheetName}</h2>
      <EditableTable data={data} dataOnChange={onDataChange} />
    </div>
  );
}
