export interface EditableTableProps {
  data: Record<string, unknown>[];
  dataOnChange?: (newData: Record<string, unknown>[]) => void;
}
