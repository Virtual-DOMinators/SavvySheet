import { ExportButton } from '@components/export';
import type { SheetData, ExcelRow } from '@types';
import type { ExportColumn } from '@components/export';

interface ExportToolbarProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[]; // <-- Här är rätt typ!
  filename?: string;
}

export function ExportToolbar({ sheets, columns, filename }: ExportToolbarProps) {
  const sheetNames = Object.keys(sheets);

  return (
    <ExportButton
      data={sheetNames.flatMap((sheetName) =>
        sheets[sheetName].map((row) => ({ SheetName: sheetName, ...row })),
      )}
      columns={columns}
      originalFileName={filename}
    />
  );
}
