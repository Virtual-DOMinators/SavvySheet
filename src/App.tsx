import { EditableTable, ExportButton } from '@components';
import type { ExportColumn } from '@components';

// Define the row type for clarity and correct typing
interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

const initialData: IRow[] = [
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
  { make: 'Fiat', model: '500', price: 15774, electric: false },
  { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
];

// Correctly typed columns
const exportColumns: ExportColumn<IRow>[] = [
  { field: 'make', headerName: 'Make' },
  { field: 'model', headerName: 'Model' },
  { field: 'price', headerName: 'Price' },
  { field: 'electric', headerName: 'Electric' },
];

function App() {
  const handleDataChange = (updatedData: IRow[]) => {
    console.log('Uppdaterad data:', updatedData);
  };

  return (
    <div>
      <h1>Bil-tabell</h1>
      <EditableTable data={initialData} dataOnChange={handleDataChange} />
      <ExportButton<IRow> data={initialData} columns={exportColumns} filename="bilar-export.pdf" />
    </div>
  );
}

export default App;
