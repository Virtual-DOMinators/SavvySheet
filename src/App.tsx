import { EditableTable, Header } from '@components';
import { ExportButton } from '@exportbutton';
import UploadFile from 'Components/UploadFile';
import type { ExportColumn } from '@components';
import { useState } from 'react';

type ExcelRow = {
  [key: string]: string | number | boolean | null;
};

type SheetData = {
  [sheetName: string]: ExcelRow[];
};

function App() {
  const [sheets, setSheets] = useState<SheetData>({});
  const [columns, setColumns] = useState<{ [sheetName: string]: ExportColumn<ExcelRow>[] }>({});
  const [filename, setFilename] = useState<string | undefined>(undefined);

  const handleDataChange = (sheetData: SheetData) => {
    setSheets(sheetData);

    const newColumns: { [sheetName: string]: ExportColumn<ExcelRow>[] } = {};

    Object.entries(sheetData).forEach(([sheetName, data]) => {
      if (data.length > 0) {
        const keys = Object.keys(data[0]);
        newColumns[sheetName] = keys.map((key) => ({
          field: key,
          headerName: key,
        }));
      }
    });
    setColumns(newColumns);
  };

  return (
    <div className="m-2">
      <Header />
      <UploadFile
        onDataParsed={(parsedSheets, fileName) => {
          handleDataChange(parsedSheets);
          setFilename(fileName);
        }}
      />
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
        data={data}
        columns={columns[sheetName] || []}
        originalFileName={`${filename || 'export'} - ${sheetName}`}
      />
    </div>
  );
}

export default App;
