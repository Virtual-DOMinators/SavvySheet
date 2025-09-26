import '../styles/App.css';
import Footer from 'Components/Footer';
import Instructions from 'Components/Instructions';
import { EditableTable, ExportButton, Header } from '@components';
import type { IRow } from 'models/IRow';
import type { ExportColumn } from '@components';

interface HomeProps {
  handleDataChange: (updatedData: IRow[]) => void;
  initialData: IRow[];
  exportColumns: ExportColumn<IRow>[];
}

export default function Homepage(props: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header></Header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {/* File Upload */}

        {/* Table */}
        <EditableTable data={props.initialData} dataOnChange={props.handleDataChange} />

        <section className="mt-4">
          <ExportButton<IRow>
            data={props.initialData}
            columns={props.exportColumns}
            filename="bilar-export.pdf"
          />
        </section>

        {/* Instructions */}
        <section className="mt-4">
          <Instructions></Instructions>
        </section>
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
