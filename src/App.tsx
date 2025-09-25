import { EditableTable, ExportButton } from '@components';
import UploadFile from 'Components/UploadFile';
import type { ExportColumn } from '@components';
import React, { useState } from 'react';

// Define the row type for clarity and correct typing
// interface IRow {
//   make: string;
//   model: string;
//   price: number;
//   electric: boolean;
// }

// const initialData: IRow[] = [
//   { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
//   { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
//   { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
//   { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
//   { make: 'Fiat', model: '500', price: 15774, electric: false },
//   { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
// ];

// Correctly typed columns
// const exportColumns: ExportColumn<IRow>[] = [
//   { field: 'make', headerName: 'Make' },
//   { field: 'model', headerName: 'Model' },
//   { field: 'price', headerName: 'Price' },
//   { field: 'electric', headerName: 'Electric' },
// ];

type RowData = {
  [key: string]: string | number | boolean | null;
};

function App() {
  const [tableData, setTableDate] = useState<RowData[]>([]);

  const handleDataChange = (updatedData: RowData[]) => {
    setTableDate(updatedData);
    console.log('Uppdaterad data:', updatedData);
  };

  const exportColumns: ExportColumn<RowData>[] =
    tableData.length > 0
      ? Object.keys(tableData[0]).map((key) => ({
          field: key,
          headerName: key,
        }))
      : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tabellhanteraren</h1>
      <UploadFile onDataParsed={handleDataChange} />
      {tableData.length > 0 && (
        <>
          {/* integrera med editabletable */}
          <EditableTable data={tableData} dataOnChange={handleDataChange} />
          <div className="mt-4">
            <ExportButton<RowData>
              data={tableData}
              columns={exportColumns}
              filename="exporterad-tabell.pdf"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
