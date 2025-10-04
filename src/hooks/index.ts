/**
 * hooks/index.ts - Central export point för custom React hooks
 *
 * Detta är en barrel export file för alla custom hooks.
 *
 * Purpose:
 * - Centraliserad import-punkt för hooks
 * - Enklare imports: import { useLocalSheet, useSheetColumns } from '@hooks'
 * - Konsekvent pattern med andra index-filer
 *
 * Hooks:
 * - useLocalSheet: localStorage-persistens för sheet-data
 * - useSheetColumns: Generera kolumndefinitioner från sheets
 *
 * Användning:
 * ```typescript
 * import { useLocalSheet, useSheetColumns } from '@hooks';
 *
 * const [sheets, setSheets] = useState<SheetData>({});
 * useLocalSheet(sheets, setSheets, filename, setFilename);
 * const columns = useSheetColumns(sheets);
 * ```
 *
 * Pattern:
 * - export { default as hookName } from './hookName'
 * - Re-exporterar default export med samma namn
 */

// Exporterar useLocalSheet hook för localStorage-persistens
export { default as useLocalSheet } from './useLocalSheet';

// Exporterar useSheetColumns hook för kolumngenerering
export { default as useSheetColumns } from './useSheetColumns';
