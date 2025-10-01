import { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeAlpine } from 'ag-grid-community';
import { isEqual, getColumnDefs } from '@utils';
import type { EditableTableProps, ExcelRow } from '@types';

ModuleRegistry.registerModules([AllCommunityModule]);

const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  const gridApiRef = useRef<GridApi | null>(null);
  const lastSavedDataRef = useRef<ExcelRow[]>(data);

  const colDefs: ColDef[] = getColumnDefs(data);

  const saveData = () => {
    if (!gridApiRef.current) return;
    gridApiRef.current.stopEditing();
    const updatedData: { [key: string]: unknown }[] = [];
    gridApiRef.current.forEachNode((node) => {
      updatedData.push(node.data);
    });

    const typedData: ExcelRow[] = updatedData.map((row) => {
      const out: ExcelRow = {};
      Object.entries(row).forEach(([key, value]) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null
        ) {
          out[key] = value;
        } else {
          out[key] = String(value);
        }
      });
      return out;
    });

    // Endast spara om datan har ändrats
    if (!isEqual(typedData, lastSavedDataRef.current)) {
      lastSavedDataRef.current = typedData;
      dataOnChange?.(typedData);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full rounded-md text-gray-600 italic border-2 border-gray-400">
          Ingen fil uppladdad än!
        </div>
      ) : (
        <div
          onMouseLeave={saveData}
          className="w-full"
          style={{
            height: '400px',
            maxHeight: '80vh',
          }}
        >
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

              const typedData: ExcelRow[] = updatedData.map((row) => {
                const out: ExcelRow = {};
                Object.entries(row).forEach(([key, value]) => {
                  if (
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean' ||
                    value === null
                  ) {
                    out[key] = value;
                  } else {
                    out[key] = String(value);
                  }
                });
                return out;
              });
              dataOnChange?.(typedData);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EditableTable;
