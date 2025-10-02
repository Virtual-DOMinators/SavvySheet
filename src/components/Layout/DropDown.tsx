import { useState } from 'react';
import { ChevronDownIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import type { SheetData, ExcelRow, ExportColumn } from '@types';
import { getPdfFilename, generatePDF } from '@utils';
import { ExportButton } from '@components/Export';

interface DropDownProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
  onUploadNewFile: () => void;
}

export default function DropDown({ sheets, columns, filename, onUploadNewFile }: DropDownProps) {
  const [open, setOpen] = useState(false);

  if (!sheets || Object.keys(sheets).length === 0) return null;

  const sheetNames = Object.keys(sheets);
  const data = sheetNames.flatMap((sheetName) =>
    sheets[sheetName].map((row) => ({ SheetName: sheetName, ...row })),
  );
  const pdfFilename = getPdfFilename(filename);

  const handleDownload = () => {
    const doc = generatePDF(data, columns);
    doc.save(pdfFilename);
    setOpen(false);
  };

  const handleShow = () => {
    const doc = generatePDF(data, columns);
    window.open(doc.output('bloburl'), '_blank');
    setOpen(false);
  };

  const handleUploadNewFile = () => {
    onUploadNewFile();
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="btn btn-inline btn-secondary inline-flex items-center rounded text-base transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Meny
        <ChevronDownIcon className="ml-2 w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg z-30 bg-base-100 border border-gray-300 py-2 flex flex-col gap-2 p-2">
          <ExportButton
            data={data}
            columns={columns}
            originalFileName={pdfFilename}
            onDownload={handleDownload}
            onShow={handleShow}
          />
          <button
            onClick={handleUploadNewFile}
            className="flex w-full  gap-2 px-4 py-2 hover:bg-gray-100 btn btn-outline"
          >
            <ArrowUpTrayIcon className="w-5 h-5" /> Ladda upp ny fil
          </button>
        </div>
      )}
    </div>
  );
}
