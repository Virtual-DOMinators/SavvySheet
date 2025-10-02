import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExportPanel } from '@components/Export';
import type { SheetData, ExcelRow, ExportColumn } from '@types';

interface HeaderProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
}

const Header: React.FC<HeaderProps> = ({ sheets, columns, filename }) => {
  const navigate = useNavigate();
  const hasData = Object.keys(sheets).length > 0;

  const handleNewFile = (): void => {
    navigate('/');
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-8">
      <div className="flex items-center gap-4">
        <img src="logo.webp" alt="Logo" className="h-12 w-12" />
        <h1 className="text-2xl font-bold">SavvySheet</h1>
      </div>
      <div className="flex items-center gap-3">
        {hasData && <ExportPanel sheets={sheets} columns={columns} filename={filename} />}
        <button className="btn btn-outline mb-4" onClick={handleNewFile}>
          Ladda upp ny fil
        </button>
      </div>
    </header>
  );
};

export default Header;
