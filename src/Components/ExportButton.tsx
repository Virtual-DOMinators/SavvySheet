import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn<T extends object> {
  field: keyof T;
  headerName?: string;
}

interface ExportButtonProps<T extends object> {
  data: T[];
  columns: ExportColumn<T>[];
  filename?: string;
}

function ExportButton<T extends object>({
  data,
  columns,
  filename = 'table-export.pdf',
}: ExportButtonProps<T>) {
  const handleExportPDF = () => {
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
    doc.save(filename);
  };

  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      onClick={handleExportPDF}
    >
      Exportera till PDF
    </button>
  );
}

export default ExportButton;
