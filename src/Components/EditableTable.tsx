import { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface EditableTableProps {
  data: { [key: string]: unknown }[];
  dataOnChange?: (newData: { [key: string]: unknown }[]) => void;
}

function isEqual(a: unknown[], b: unknown[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  const gridApiRef = useRef<GridApi | null>(null);
  const lastSavedDataRef = useRef<{ [key: string]: unknown }[]>(data);

  const colDefs: ColDef[] =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          editable: true,
          flex: 1,
          sortable: true,
          filter: true,
        }))
      : [];

  const saveData = () => {
    if (!gridApiRef.current) return;
    gridApiRef.current.stopEditing();
    const updatedData: { [key: string]: unknown }[] = [];
    gridApiRef.current.forEachNode((node) => {
      updatedData.push(node.data);
    });

    // Endast spara om datan har ändrats
    if (!isEqual(updatedData, lastSavedDataRef.current)) {
      lastSavedDataRef.current = updatedData;
      dataOnChange?.(updatedData);
    }
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full rounded-md text-gray-600 italic border-2 border-gray-400">
          Ingen fil uppladdad än!
        </div>
      ) : (
        <div onMouseLeave={saveData} style={{ width: '100%', height: '100%' }}>
          <AgGridReact
            rowData={data}
            theme={themeAlpine}
            columnDefs={colDefs}
            onGridReady={(params) => {
              gridApiRef.current = params.api as GridApi;
            }}
            onCellValueChanged={() => {
              if (!gridApiRef.current) return;
              const updatedData: { [key: string]: unknown }[] = [];
              gridApiRef.current.forEachNode((node) => {
                updatedData.push(node.data);
              });
              dataOnChange?.(updatedData);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EditableTable;
