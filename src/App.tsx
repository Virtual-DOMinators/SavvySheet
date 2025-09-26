import { EditableTable, ExportButton, Header } from '@components';
import UploadFile from 'Components/UploadFile';
import type { ExportColumn } from '@components';
import { useState } from 'react';

type ExcelRow = { [key: string]: string | number | boolean | null };

function App() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<ExportColumn<ExcelRow>[]>([]);
  const [filename, setFilename] = useState<string | undefined>(undefined);

  const handleDataChange = (jsonData: ExcelRow[]) => {
    setData(jsonData);
    if (jsonData.length > 0) {
      const keys = Object.keys(jsonData[0]);
      setColumns(keys.map((key) => ({ field: key, headerName: key })));
    }
  };

  return (
    <div>
      <Header />
      <UploadFile
        onDataParsed={(parsedData, fileName) => {
          setData(parsedData);
          handleDataChange(parsedData);
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
