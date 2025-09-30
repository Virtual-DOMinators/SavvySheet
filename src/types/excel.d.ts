export type ExcelRow = {
  [key: string]: string | number | boolean | null;
};

export type SheetData = {
  [sheetName: string]: ExcelRow[];
};
