/**
 * components/Upload/index.ts - Export point för Upload-komponenter
 *
 * Detta är en barrel export file för Upload-relaterade komponenter.
 *
 * Purpose:
 * - Centraliserad import-punkt för upload-komponenter
 * - Enklare imports: import { UploadFile } from '@components/Upload'
 *
 * Komponenter:
 * - UploadFile: Huvudkomponent för filuppladdning
 *
 * Användning:
 * ```typescript
 * import { UploadFile } from '@components/Upload';
 *
 * <UploadFile onDataParsed={handleDataParsed} />
 * ```
 */

// Exporterar UploadFile-komponenten för filuppladdning
export { default as UploadFile } from './UploadFile';
