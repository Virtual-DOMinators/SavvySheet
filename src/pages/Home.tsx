import '../styles/App.css';
import Footer from 'Components/Footer';
import Instructions from 'Components/Instructions';
import { EditableTable, ExportButton, Header } from '@components';
import type { ExportColumn } from '@components';
import UploadFile from 'Components/UploadFile';
import { useState } from 'react';

type ExcelRow = { [key: string]: string | number | boolean | null };

export default function Homepage() {
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<ExportColumn<ExcelRow>[]>([]);

  const handleDataChange = (jsonData: ExcelRow[]) => {
    setData(jsonData);

    if (jsonData.length > 0) {
      const keys = Object.keys(jsonData[0]);
      setColumns(keys.map((key) => ({ field: key, headerName: key })));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header></Header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <Header />

        <UploadFile onDataParsed={handleDataChange} />

        <EditableTable
          data={data as { [key: string]: unknown }[]}
          dataOnChange={setData as (newData: { [key: string]: unknown }[]) => void}
        />
        <section className="mt-4">
          <ExportButton data={data} columns={columns} filename="export.pdf" />
        </section>

        <section className="mt-4">
          <Instructions></Instructions>
        </section>
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}
