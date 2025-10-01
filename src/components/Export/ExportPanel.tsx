import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ExportToolbar } from '@components/Export';
import type { SheetData, ExcelRow, ExportColumn } from '@types';

interface ExportPanelProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
}

export default function ExportPanel({ sheets, columns, filename }: ExportPanelProps) {
  const [show, setShow] = useState(false);

  return (
    <section className="mt-4 flex flex-col gap-2 justify-between">
      <div className="flex items-end justify-between">
        <button
          type="button"
          aria-pressed={show}
          onClick={() => setShow((prev) => !prev)}
          className="btn btn-inline btn-secondary inline-flex items-center gap-2 rounded px-3 py-2 h-12 text-base transition"
        >
          {show ? 'Stäng Export' : 'Exportera'}
          <span aria-hidden="true" className="flex items-center">
            {show ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </span>
        </button>
        <div>{show && <ExportToolbar sheets={sheets} columns={columns} filename={filename} />}</div>
      </div>
    </section>
  );
}
