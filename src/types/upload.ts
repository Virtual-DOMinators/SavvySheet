export type RowData = {
  [key: string]: string | number | boolean | null;
};

export interface UploadFileProps {
  onDataParsed: (data: { [sheetName: string]: RowData[] }, fileName: string) => void;
}
