import { useCallback, useRef, useState } from 'react';
import { Spinner } from '@components/Ui';
import type { UploadFileProps } from '@types';

const UploadFile: React.FC<UploadFileProps> = ({ onDataParsed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.xlsx')) {
        alert('Endast .xlsx-filer stöds.');
        return;
      }
      setLoading(true);
      try {
        const { parseExcelFile } = await import('utils/uploadUtils');
        await parseExcelFile(file, onDataParsed);
      } catch (error) {
        console.error('Fel vid parsing av Excel-fil:', error);
        alert('Kunde inte läsa filen. Kontrollera att det är en giltig .xlsx-fil.');
      } finally {
        setLoading(false);
      }
    },
    [onDataParsed],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handlFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handlFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="my-6 w-screen max-w-3xl mx-auto px-2 md:px-8">
      <div
        className={`border-2 p-6 rounded-md text-center cursor-pointer transition ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-400 hover:bg-gray-50'}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <Spinner />
        ) : (
          <p className="text-gray-500">
            {isDragging ? 'Släpp filen här.' : 'Importera en .xlsx-fil'}
          </p>
        )}
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
