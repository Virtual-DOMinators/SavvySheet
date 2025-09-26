import { useState } from 'react';
import '../styles/App.css';
import { Header } from '@components';
import Footer from 'Components/Footer';
import Instructions from 'Components/Instructions';

export default function Homepage() {
  const [data, setData] = useState([]);
  const [fileName] = useState('');

  const handleFileUpload = async () => {};

  const updateCell = () => {
    const newData = [...data];
    setData(newData);
  };

  const exportToPDF = () => {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header></Header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {/* File Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ladda upp Excel-fil</h2>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {fileName && <p className="mt-2 text-green-600">Fil: {fileName}</p>}
        </div>

        {/* Table */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Redigerbar Tabell</h2>
              <button
                onClick={exportToPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Exportera PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-100' : ''}>
                      {/* Loopa genom data och visa celler */}
                      <td className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value=""
                          onChange={() => updateCell()}
                          className="w-full p-1 border-none outline-none bg-transparent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        {data.length === 0 && <Instructions></Instructions>}
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
