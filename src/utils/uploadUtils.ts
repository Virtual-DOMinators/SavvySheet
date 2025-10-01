import * as XLSX from 'xlsx';
import type { RowData } from '@types';

export function parseExcelFile(
  file: File,
  onDataParsed: (data: { [sheetName: string]: RowData[] }, fileName: string) => void,
) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const allSheets: { [sheetName: string]: RowData[] } = {};

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      allSheets[sheetName] = jsonData;
    });

    onDataParsed(allSheets, file.name);
  };
  reader.readAsArrayBuffer(file);
}
