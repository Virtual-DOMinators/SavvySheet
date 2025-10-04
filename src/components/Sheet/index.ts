/**
 * components/Sheet/index.ts - Export point för Sheet-komponenter
 *
 * Detta är en barrel export file för Sheet-relaterade komponenter.
 *
 * Purpose:
 * - Centraliserad import-punkt för sheet-komponenter
 * - Enklare imports: import { EditableTable, SheetView, SheetNavigation } from '@components/Sheet'
 *
 * Komponenter:
 * - EditableTable: AG Grid-baserad redigerbar tabell
 * - SheetNavigation: Navigeringsknappar mellan sheets
 * - SheetView: Wrapper för sheet-visning med rubrik
 *
 * Användning:
 * ```typescript
 * import { EditableTable, SheetView, SheetNavigation } from '@components/Sheet';
 *
 * <SheetView sheetName={name} data={data} onDataChange={onChange} />
 * <EditableTable data={data} dataOnChange={onChange} />
 * <SheetNavigation currentIdx={idx} maxIdx={max} onPrev={prev} onNext={next} />
 * ```
 */

// Exporterar EditableTable-komponenten för redigerbar tabell
export { default as EditableTable } from './EditableTable';

// Exporterar SheetNavigation-komponenten för sheet-navigering
export { default as SheetNavigation } from './SheetNavigation';

// Exporterar SheetView-komponenten för sheet-visning
export { default as SheetView } from './SheetView';
