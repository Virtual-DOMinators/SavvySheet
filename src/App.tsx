import { EditableTable, ExportButton, Header } from '@components';
import UploadFile from 'Components/UploadFile';
import type { ExportColumn } from '@components';
import Homepage from './pages/Home';
import type { IRow } from 'models/IRow';

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
  const [data, setData] = useState<ExcelRow[]>([]);
  const [columns, setColumns] = useState<ExportColumn<ExcelRow>[]>([]);

  const handleDataChange = (jsonData: ExcelRow[]) => {
    setData(jsonData);

    if (jsonData.length > 0) {
      const keys = Object.keys(jsonData[0]);
      setColumns(keys.map((key) => ({ field: key, headerName: key })));
    }
  };

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
      <Header />
      <UploadFile onDataParsed={handleDataChange} />
      <EditableTable
        data={data as { [key: string]: unknown }[]}
        dataOnChange={setData as (newData: { [key: string]: unknown }[]) => void}
      />
      <ExportButton data={data} columns={columns} filename="export.pdf" />
      <h1>Bil-tabell</h1>
      <Homepage
        handleDataChange={handleDataChange}
        initialData={initialData}
        exportColumns={exportColumns}
      ></Homepage>
    </div>
  );
}

export default App;
