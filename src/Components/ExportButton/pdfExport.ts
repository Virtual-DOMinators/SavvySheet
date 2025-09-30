import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportColumn } from './ExportColumn';

export function getPdfFilename(originalFileName?: string): string {
  if (!originalFileName) return 'table-savvysheet.pdf';
  const dotIndex = originalFileName.lastIndexOf('.');
  const basename = dotIndex > 0 ? originalFileName.substring(0, dotIndex) : originalFileName;
  return `${basename}-savvysheet.pdf`;
}

export function generatePDF<T extends Record<string, unknown> & { SheetName?: string }>(
  data: T[],
  _columns: ExportColumn<T>[],
) {
  const doc = new jsPDF();

  const grouped: Record<string, T[]> = {};
  data.forEach((row) => {
    const sheet = row.SheetName || 'Sheet';
    if (!grouped[sheet]) grouped[sheet] = [];
    grouped[sheet].push(row);
  });

  let first = true;
  Object.entries(grouped).forEach(([sheet, rows]) => {
    if (!first) doc.addPage();
    first = false;

    doc.setFontSize(14);
    doc.text(`${sheet}`, 14, 20);

    const sheetCols = Object.keys(rows[0] || {}).filter((k) => k !== 'SheetName');

    const head = [sheetCols];
    const body: (string | number)[][] = rows.map((row) =>
      sheetCols.map((col) => {
        const value = row[col as keyof typeof row];
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number' || typeof value === 'string') return value;
        if (value === null || value === undefined) return '';
        return String(value);
      }),
    );

    autoTable(doc, { head, body, startY: 30 });
  });
  return doc;
}
