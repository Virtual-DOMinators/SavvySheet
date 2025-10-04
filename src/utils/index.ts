/**
 * utils/index.ts - Central export point för utility-funktioner
 *
 * Detta är en barrel export file för alla utility-funktioner.
 *
 * Purpose:
 * - Centraliserad import-punkt för utils
 * - Enklare imports: import { parseExcelFile, generatePDF, getColumnDefs } from '@utils'
 * - Gruppera relaterade utilities
 *
 * Utilities:
 * - exportUtils: getPdfFilename, generatePDF - PDF-export
 * - tableUtils: isEqual, getColumnDefs - Tabellhantering
 * - uploadUtils: parseExcelFile - Excel-fil parsing
 *
 * Användning:
 * ```typescript
 * import { parseExcelFile, generatePDF, getColumnDefs } from '@utils';
 *
 * // Upload
 * await parseExcelFile(file, callback);
 *
 * // Export
 * const doc = generatePDF(data, columns);
 *
 * // Table
 * const cols = getColumnDefs(data);
 * ```
 *
 * Pattern:
 * - export * from './filename': Re-exporterar alla named exports
 * - Detta fungerar för funktioner exporterade med export function
 */

// Exporterar export utilities (getPdfFilename, generatePDF)
export * from './exportUtils';

// Exporterar table utilities (isEqual, getColumnDefs)
export * from './tableUtils';

// Exporterar upload utilities (parseExcelFile)
export * from './uploadUtils';
