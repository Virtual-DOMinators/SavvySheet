import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface EditableTableProps {
  data: { [key: string]: unknown }[];
  dataOnChange?: (newData: { [key: string]: unknown }[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ data, dataOnChange }) => {
  const rowData = data;

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

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: 400 }}>
      {rowData.length === 0 ? (
        <div className="flex items-center justify-center h-full rounded-md text-gray-600 italic border-2 border-gray-400git">
          Ingen fil uppladdad än!
        </div>
      ) : (
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          onCellValueChanged={(params) => {
            // Get all row data from the grid
            const updatedData: { [key: string]: unknown }[] = [];
            params.api.forEachNode((node) => {
              updatedData.push({ ...node.data });
            });
            // Call the save handler
            dataOnChange?.(updatedData);
          }}
        />
      )}
    </div>
  );
};

export default EditableTable;
