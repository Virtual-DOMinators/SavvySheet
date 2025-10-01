import type { ColDef } from 'ag-grid-community';

export function isEqual(a: unknown[], b: unknown[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getColumnDefs(data: Record<string, unknown>[]): ColDef[] {
  if (!data || data.length === 0) return [];
  return Object.keys(data[0]).map((key) => ({
    field: key,
    editable: true,
    flex: 1,
    sortable: true,
    filter: true,
  }));
}
