/**
 * types/index.ts - Central export point för alla TypeScript types
 *
 * Detta är en barrel export file som re-exporterar alla types från type-filer.
 *
 * Purpose:
 * - Centraliserad import-punkt för types
 * - Enklare imports: import { ExcelRow, SheetData } from '@types'
 * - Istället för: import { ExcelRow } from '@types/excel'; import { SheetData } from '@types/sheet';
 *
 * Pattern:
 * - export * from './filename': Re-exporterar alla exports från filen
 * - Detta är ett vanligt mönster i TypeScript-projekt
 * - Kallas "barrel exports" eller "index exports"
 *
 * Fördelar:
 * - Cleaner imports i komponenter
 * - Single source of truth för types
 * - Lättare att refaktorera (ändra filstruktur utan att uppdatera imports)
 * - Bättre organization (gruppera relaterade types)
 *
 * Användning:
 * ```typescript
 * // Istället för:
 * import { ExcelRow } from '@types/excel';
 * import { SheetData } from '@types/excel';
 * import { ExportColumn } from '@types/export';
 *
 * // Kan vi göra:
 * import { ExcelRow, SheetData, ExportColumn } from '@types';
 * ```
 *
 * Files:
 * - excel.ts: ExcelRow, SheetData
 * - export.ts: ExportColumn
 * - sheet.ts: EditableTableProps, SheetColumn
 * - upload.ts: RowData, UploadFileProps
 */

// Exporterar Excel-relaterade types (ExcelRow, SheetData)
export * from './excel';

// Exporterar Export-relaterade types (ExportColumn)
export * from './export';

// Exporterar Sheet-relaterade types (EditableTableProps, SheetColumn)
export * from './sheet';

// Exporterar Upload-relaterade types (RowData, UploadFileProps)
export * from './upload';
