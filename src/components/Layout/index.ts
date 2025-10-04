/**
 * components/Layout/index.ts - Export point för Layout-komponenter
 *
 * Detta är en barrel export file för Layout-relaterade komponenter.
 *
 * Purpose:
 * - Centraliserad import-punkt för layout-komponenter
 * - Enklare imports: import { Header, DropDown } from '@components/Layout'
 *
 * Komponenter:
 * - Header: Huvudnavigering med logo och meny
 * - DropDown: Dropdown-meny för export och filhantering
 *
 * Användning:
 * ```typescript
 * import { Header, DropDown } from '@components/Layout';
 *
 * <Header sheets={sheets} columns={columns} filename={filename} />
 * <DropDown sheets={sheets} columns={columns} filename={filename} onUploadNewFile={handler} />
 * ```
 */

// Exporterar Header-komponenten för huvudnavigering
export { default as Header } from './Header';

// Exporterar DropDown-komponenten för meny-funktionalitet
export { default as DropDown } from './DropDown';
