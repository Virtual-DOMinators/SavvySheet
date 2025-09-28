export interface ExportColumn<T extends object> {
  field: keyof T;
  headerName?: string;
}
