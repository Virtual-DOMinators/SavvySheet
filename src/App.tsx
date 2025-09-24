import '@styles/App.css';
import EditableTable from './Components/EditableTable';

function App() {
  const initialData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
    { make: 'Fiat', model: '500', price: 15774, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
  ];

  const handleDataChange = (updatedData: typeof initialData) => {
    console.log('Uppdaterad data:', updatedData);
  };

  return (
    <div>
      <h1>Bil-tabell</h1>
      <EditableTable data={initialData} dataOnChange={handleDataChange} />
    </div>
  );
}

export default App;
