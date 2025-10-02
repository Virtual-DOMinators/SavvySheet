import React, { useRef, useCallback } from 'react';
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

  const saveData = useCallback(() => {
    if (!gridApiRef.current) return;
    gridApiRef.current.stopEditing();

    const updatedData: ExcelRow[] = [];
    gridApiRef.current.forEachNode((node) => {
      const row: ExcelRow = {};
      Object.entries(node.data as Record<string, unknown>).forEach(([key, value]) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null
        ) {
          row[key] = value;
        } else {
          row[key] = String(value);
        }
      });
      updatedData.push(row);
    });

    if (!isEqual(updatedData, lastSavedDataRef.current)) {
      lastSavedDataRef.current = updatedData;
      dataOnChange(updatedData);
    }
  }, [dataOnChange]);

  return (
    <div className="w-full h-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full rounded-md text-gray-600 italic border-2 border-gray-400">
          Ingen fil uppladdad än!
        </div>
      ) : (
        <div
          onMouseLeave={saveData}
          className="w-full h-full"
          style={{ height: 'calc(100vh - 250px)' }}
        >
          <div className="ag-theme-alpine w-full h-full">
            <AgGridReact
              rowData={data}
              theme={themeAlpine}
              columnDefs={colDefs}
              onGridReady={(params) => {
                gridApiRef.current = params.api as GridApi;
              }}
              onCellValueChanged={saveData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableTable;
