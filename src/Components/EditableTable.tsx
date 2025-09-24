import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface IRow {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

interface EditableTableProps {
  data: IRow[];
  dataOnChange?: (newData: IRow[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  const [rowData, setRowData] = useState<IRow[]>(data);

  const [colDefs] = useState<ColDef<IRow>[]>([
    { field: 'make', editable: true },
    { field: 'model', editable: true },
    { field: 'price', editable: true },
    { field: 'electric', editable: true },
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: 400 }}>
      <AgGridReact<IRow>
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={(params) => {
          const updatedData = params.api.getRenderedNodes().map((n) => n.data as IRow);
          setRowData(updatedData);
          dataOnChange?.(updatedData);
        }}
      />
    </div>
  );
};

export default EditableTable;
