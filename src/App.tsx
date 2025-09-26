import { EditableTable, ExportButton } from '@components';
import type { ExportColumn } from '@components';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

type ExcelRow = { [key: string]: string | number | boolean | null };

function App() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<ExportColumn<ExcelRow>[]>([]);

  useEffect(() => {
    fetch('/Files/placeholder.xlsx')
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        setData(jsonData);

        if (jsonData.length > 0) {
          const keys = Object.keys(jsonData[0]);
          setColumns(keys.map((key) => ({ field: key, headerName: key })));
        }
      })
      .catch((err) => console.error('Fel vid laddning ac Excel-fil', err));
  }, []);

  return (
    <div>
      <h1>Savvy Sheet</h1>
      <EditableTable
        data={data as { [key: string]: unknown }[]}
        dataOnChange={setData as (newData: { [key: string]: unknown }[]) => void}
      />
      <ExportButton data={data} columns={columns} filename="export.pdf" />
    </div>
  );
}

export default App;
