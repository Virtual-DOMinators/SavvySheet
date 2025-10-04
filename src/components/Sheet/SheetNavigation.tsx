/**
 * SheetNavigation.tsx - Komponent för navigering mellan sheets
 *
 * Visar två knappar för att navigera mellan olika sheets i en Excel-fil.
 *
 * Funktionalitet:
 * - "Föregående"-knapp: Går till föregående sheet
 * - "Nästa"-knapp: Går till nästa sheet
 * - Automatic disabling: Knappar disablas vid gränser
 *
 * Props:
 * - currentIdx: Nuvarande sheet-index (0-baserat)
 * - maxIdx: Högsta tillgängliga index (antal sheets - 1)
 * - onPrev: Callback för föregående-knappen
 * - onNext: Callback för nästa-knappen
 *
 * Visas endast när:
 * - Excel-filen innehåller fler än ett sheet
 * - Renderas conditional i SheetPage
 */

/**
 * SheetNavigationProps - Interface för SheetNavigation-komponentens props
 *
 * @property {number} currentIdx - Aktuellt sheet-index (0, 1, 2, etc.)
 * @property {number} maxIdx - Högsta index (om 3 sheets: maxIdx = 2)
 * @property {Function} onPrev - Callback när användaren klickar "Föregående"
 * @property {Function} onNext - Callback när användaren klickar "Nästa"
 */
interface SheetNavigationProps {
  currentIdx: number;
  maxIdx: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * SheetNavigation - Komponent för sheet-navigering
 *
 * Auto-disable logik:
 * - Prev disabled när currentIdx === 0 (första sheet)
 * - Next disabled när currentIdx === maxIdx (sista sheet)
 *
 * @param {SheetNavigationProps} props - Props med index och callbacks
 * @returns {JSX.Element} Två navigeringsknappar
 */
function SheetNavigation({ currentIdx, maxIdx, onPrev, onNext }: SheetNavigationProps) {
  return (
    /**
     * Container: Centrerad flex-layout för knapparna
     *
     * Classes:
     * - flex: Flex-layout
     * - gap-4: Space mellan knapparna
     * - justify-center: Horisontell centrering
     */
    <div className="flex gap-4 justify-center">
      {/**
       * Föregående-knapp: Navigera till föregående sheet
       *
       * Props:
       * - onClick: Trigger onPrev callback
       * - disabled: true när currentIdx === 0 (första sheet)
       * - className: DaisyUI button classes
       *   - btn: Base button styling
       *   - btn-outline: Outline variant
       *
       * Content: "Föregående" (svensk text)
       *
       * Disabled state:
       * - Visuellt: Nedtonad färg, inte klickbar
       * - Funktionellt: onClick triggas inte
       * - Accessibility: disabled-attribut för screen readers
       */}
      <button onClick={onPrev} disabled={currentIdx === 0} className="btn btn-outline">
        Föregående
      </button>

      {/**
       * Nästa-knapp: Navigera till nästa sheet
       *
       * Props:
       * - onClick: Trigger onNext callback
       * - disabled: true när currentIdx === maxIdx (sista sheet)
       * - className: DaisyUI button classes (samma som prev)
       *
       * Content: "Nästa" (svensk text)
       *
       * Disabled state:
       * - Samma beteende som föregående-knappen
       * - Förhindrar navigering utanför gränser
       */}
      <button onClick={onNext} disabled={currentIdx === maxIdx} className="btn btn-outline">
        Nästa
      </button>
    </div>
  );
}

export default SheetNavigation;
