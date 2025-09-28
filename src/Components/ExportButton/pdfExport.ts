import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ExportColumn } from './ExportColumn';

export function getPdfFilename(originalFileName?: string): string {
  if (!originalFileName) return 'table-savvysheet.pdf';
  const dotIndex = originalFileName.lastIndexOf('.');
  const basename = dotIndex > 0 ? originalFileName.substring(0, dotIndex) : originalFileName;
  return `${basename}-savvysheet.pdf`;
}

export function generatePDF<T extends object>(data: T[], columns: ExportColumn<T>[]) {
  const doc = new jsPDF();
  const head = [columns.map((col) => col.headerName || String(col.field))];
  const body: (string | number)[][] = data.map((row) =>
    columns.map((col) => {
      const value = row[col.field];
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (typeof value === 'number' || typeof value === 'string') return value;
      if (value === null || value === undefined) return '';
      return String(value);
    }),
  );
  autoTable(doc, { head, body });
  return doc;
}
