import { useRef } from 'react';
import * as XLSX from 'xlsx';

type RowData = {
  [key: string]: string | number | boolean | null;
};

interface UploadFileProps {
  onDataParsed: (data: RowData[]) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onDataParsed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      onDataParsed(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      handleFile(file);
    } else {
      alert('Endast .xlsx-filer stöds');
    }
  };

  return (
    <div className="my-4">
      <div
        className="border-2 border-gray-400 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-gray-600">Importera en .xlsx-fil</p>
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
