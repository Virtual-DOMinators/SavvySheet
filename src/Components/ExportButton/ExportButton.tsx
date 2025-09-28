import { DocumentArrowDownIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getPdfFilename, generatePDF } from '@exportbutton';
import type { ExportColumn } from '@exportbutton';

interface ExportButtonProps<T extends object> {
  data: T[];
  columns: ExportColumn<T>[];
  originalFileName?: string;
}

function ExportButton<T extends object>({ data, columns, originalFileName }: ExportButtonProps<T>) {
  if (!data || data.length === 0) return null;

  const pdfFilename = getPdfFilename(originalFileName);

  const handleDownload = () => {
    const doc = generatePDF(data, columns);
    doc.save(pdfFilename);
  };

  const handleShow = () => {
    const doc = generatePDF(data, columns);
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
