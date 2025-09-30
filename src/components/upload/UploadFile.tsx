import { useRef } from 'react';
import { parseExcelFile } from '@components/upload';
import type { UploadFileProps } from '@components/upload';

const UploadFile: React.FC<UploadFileProps> = ({ onDataParsed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      parseExcelFile(file, onDataParsed);
    } else {
      alert('Endast .xlsx-filer stöds');
    }
  };

  return (
    <div className="my-4">
      <div
        className="border-2 border-gray-400 p-6 rounded-md text-center text-gray-400 cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-gray-500">Importera en .xlsx-fil</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default UploadFile;
