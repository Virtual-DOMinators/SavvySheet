import { useNavigate } from 'react-router-dom';
import { EditableTable } from '@components/Sheet';
import type { ExcelRow, ExportColumn } from '@types';

interface SheetViewProps {
  sheetName: string;
  data: ExcelRow[];
  onDataChange: (newData: ExcelRow[]) => void;
  columns: ExportColumn<ExcelRow>[];
  originalFileName?: string;
}

function SheetView({
  sheetName,
  data,
  onDataChange,
  columns: _columns,
  originalFileName: _originalFileName,
}: SheetViewProps) {
  const navigate = useNavigate();
  const handleNewFile = () => {
    onDataChange([]);
    navigate('/');
  };

  return (
    <div className="pt-2">
      <button className="btn btn-outline mb-4" onClick={handleNewFile}>
        Ladda upp ny fil
      </button>
      <h2 className="text-xl font-bold mb-2">{sheetName}</h2>
      <EditableTable data={data} dataOnChange={onDataChange} />
    </div>
  );
}

export default SheetView;
