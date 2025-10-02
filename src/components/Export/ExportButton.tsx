import { DocumentArrowDownIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ExportColumn } from '@types';

interface ExportButtonProps<T extends Record<string, unknown> & { SheetName?: string }> {
  data: T[];
  columns: ExportColumn<T>[];
  originalFileName?: string;
  onDownload: () => void;
  onShow: () => void;
}

function ExportButton<T extends Record<string, unknown> & { SheetName?: string }>({
  onDownload,
  onShow,
}: ExportButtonProps<T>) {
  return (
    <div className="export-section flex flex-col gap-2">
      <button type="button" onClick={onDownload} className="btn btn-outline btn-primary">
        <DocumentArrowDownIcon />
        Ladda ner PDF
      </button>
      <button type="button" onClick={onShow} className="btn btn-outline btn-secondary">
        <DocumentMagnifyingGlassIcon />
        Visa PDF
      </button>
    </div>
  );
}

export default ExportButton;
