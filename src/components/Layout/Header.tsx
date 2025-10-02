import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DropDown } from '@components/Layout';
import type { SheetData, ExcelRow, ExportColumn } from '@types';

interface HeaderProps {
  sheets: SheetData;
  columns: ExportColumn<ExcelRow>[];
  filename?: string;
}

const Header: React.FC<HeaderProps> = ({ sheets, columns, filename }) => {
  const navigate = useNavigate();
  const hasData = Object.keys(sheets).length > 0;

  const handleNewFile = () => {
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center border-b-3 p-3">
      <div className="flex items-center gap-4 p-4">
        <img src="logo.webp" alt="Logo" className="h-12 w-12" />
        <h1 className="text-3xl font-bold font-grand-hotel">SavvySheet</h1>
      </div>
      <div className="flex items-center gap-4 p-2">
        {hasData && (
          <DropDown
            sheets={sheets}
            columns={columns}
            filename={filename}
            onUploadNewFile={handleNewFile}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
