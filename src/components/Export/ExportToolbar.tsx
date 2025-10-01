import { ExportButton } from '@components/Export';
import type { SheetData, ExcelRow, ExportColumn } from '@types';

interface ExportToolbarProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
}

function ExportToolbar({ sheets, columns, filename }: ExportToolbarProps) {
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

export default ExportToolbar;
