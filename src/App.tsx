import { useState } from 'react';
import { EditableTable } from '@components/table';
import { Header } from '@components/layout';
import { UploadFile } from '@components/upload';
import { ExportButton } from '@components/export';
import { useLocalSheet, useSheetColumns } from '@hooks';
import type { ExcelRow, SheetData } from '@types';

function App() {
  const [sheets, setSheets] = useState<SheetData>({});
  const [filename, setFilename] = useState<string | undefined>();
  useLocalSheet(sheets, setSheets, filename, setFilename);

  const columns = useSheetColumns(sheets);

  const handleDataParsed = (parsedSheets: SheetData, fileName: string) => {
    setSheets(parsedSheets);
    setFilename(fileName);
  };

  return (
    <div className="m-2 max-w-3xl mx-auto">
      <Header />
      <UploadFile onDataParsed={handleDataParsed} />
      {Object.entries(sheets).length === 0 ? (
        <div className="text-center text-gray-500 mt-10">Ingen fil uppladdad ännu.</div>
      ) : (
        Object.entries(sheets).map(([sheetName, data]) => (
          <div key={sheetName} className="my-8">
            <h2 className="text-xl font-bold mb-2">{sheetName}</h2>
            <EditableTable
              data={data}
              dataOnChange={(newData) =>
                setSheets((prev) => ({ ...prev, [sheetName]: newData as ExcelRow[] }))
              }
            />
          </div>
        ))
      )}
      <ExportButton
        data={Object.entries(sheets).flatMap(([sheetName, rows]) =>
          rows.map((row) => ({ SheetName: sheetName, ...row })),
        )}
        columns={Object.values(columns).flat()}
        originalFileName={filename}
      />
    </div>
  );
}

export default App;
