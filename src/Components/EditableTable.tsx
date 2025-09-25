import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface EditableTableProps {
  data: { [key: string]: unknown }[];
  dataOnChange?: (newData: { [key: string]: unknown }[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  const [rowData, setRowData] = useState<{ [key: string]: unknown }[]>(data);
  const [colDefs, setColDefs] = useState<ColDef<{ [key: string]: unknown }>[]>([]);

  useEffect(() => {
    setRowData(data);

    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      const cols: ColDef[] = keys.map((key) => ({
        field: key,
        editable: true,
        flex: 1,
        sortable: true,
        filter: true,
      }));
      setColDefs(cols);
    }
  }, [data]);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: 400 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellValueChanged={(params) => {
          const updatedData = params.api
            .getRenderedNodes()
            .map((n) => n.data as { [key: string]: unknown });
          setRowData(updatedData);
          dataOnChange?.(updatedData);
        }}
      />
    </div>
  );
};

export default EditableTable;
