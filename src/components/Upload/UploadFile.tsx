import { useRef, useState } from 'react';
import { Spinner } from '@components/Ui';
import type { UploadFileProps } from '@types';

const UploadFile: React.FC<UploadFileProps> = ({ onDataParsed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.xlsx')) {
      setLoading(true);
      try {
        // Lazy-load parsern först när fil faktiskt väljs
        const { parseExcelFile } = await import('utils/uploadUtils');
        await parseExcelFile(file, onDataParsed);
      } catch (error) {
        console.error('Fel vid parsing av Excel-fil:', error);
        alert('Kunde inte läsa filen. Kontrollera att det är en giltig .xlsx-fil.');
      } finally {
        setLoading(false);
      }
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
        {loading ? <Spinner /> : <p className="text-gray-500">Importera en .xlsx-fil</p>}
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
