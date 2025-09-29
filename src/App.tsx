import { EditableTable, Header, UploadFile } from '@components';
import { ExportButton } from '@exportbutton';
import { useLocalSheet } from '@hooks';
import type { ExportColumn } from '@components';
import { useState, useEffect } from 'react';

type ExcelRow = { [key: string]: string | number | boolean | null };

function App() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<ExportColumn<ExcelRow>[]>([]);
  const [filename, setFilename] = useState<string | undefined>(undefined);

  // Spara/ladda data + filnamn med localStorage
  useLocalSheet(data, setData, filename, setFilename);

  // Sätt kolumner automatiskt när data ändras
  useEffect(() => {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      setColumns(keys.map((key) => ({ field: key, headerName: key })));
    }
  }, [data]);

  return (
    <div>
      <Header />
      <UploadFile
        onDataParsed={(parsedData, fileName) => {
          setData(parsedData);
          setFilename(fileName);
        }}
      />

      <EditableTable
        data={data as { [key: string]: unknown }[]}
        dataOnChange={setData as (newData: { [key: string]: unknown }[]) => void}
      />
      <ExportButton data={data} columns={columns} originalFileName={filename} />
    </div>
  );
}

export default App;
