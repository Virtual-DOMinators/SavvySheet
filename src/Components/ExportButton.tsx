import { DocumentArrowDownIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn<T extends object> {
  field: keyof T;
  headerName?: string;
}

interface ExportButtonProps<T extends object> {
  data: T[];
  columns: ExportColumn<T>[];
  originalFileName?: string;
}

function getPdfFilename(originalFileName?: string) {
  if (!originalFileName) return 'table-savvysheet.pdf';
  const dotIndex = originalFileName.lastIndexOf('.');
  const basename = dotIndex > 0 ? originalFileName.substring(0, dotIndex) : originalFileName;
  return `${basename}-savvysheet.pdf`;
}

function ExportButton<T extends object>({ data, columns, originalFileName }: ExportButtonProps<T>) {
  if (!data || data.length === 0) {
    return null;
  }

  const pdfFilename = getPdfFilename(originalFileName);

  const generatePDF = () => {
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
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(pdfFilename);
  };

  const handleShow = () => {
    const doc = generatePDF();
    window.open(doc.output('bloburl'), '_blank');
  };

  return (
    <div className="export-section">
      <button type="button" onClick={handleDownload} className="download-pdf-button">
        <DocumentArrowDownIcon />
        Ladda ner PDF
      </button>
      <button type="button" onClick={handleShow} className="show-pdf-button">
        <DocumentMagnifyingGlassIcon />
        Visa PDF
      </button>
    </div>
  );
}

export default ExportButton;
