/**
 * Spinner.tsx - Loading spinner-komponent
 *
 * Detta är en visuellt tilltalande loading spinner med dubbla roterande ringar.
 *
 * Design:
 * - Fullscreen overlay med semi-transparent bakgrund
 * - Två ringar som roterar i motsatta riktningar
 * - Färgschema: Cyan, pink, purple, green (matchar app-tema)
 * - Custom animations (definierade i index.css)
 *
 * Används i:
 * - App.tsx: Suspense fallback för AppRouter
 * - SheetPage.tsx: Suspense fallback för lazy-loaded komponenter
 * - UploadFile.tsx: Under fil-parsing
 *
 * Animationer (från index.css):
 * - animate-spin: Standard React rotation (första ringen)
 * - animate-spin-slow: Långsammare rotation (1.8s)
 * - animate-spin-reverse: Reverse rotation (1.5s)
 *
 * Detta skapar en hypnotisk dubbel-rotations-effekt.
 *
 * @returns {JSX.Element} Fullscreen spinner overlay
 */

const Spinner: React.FC = () => (
  /**
   * Outer container: Fullscreen fixed overlay
   *
   * Classes:
   * - fixed inset-0: Fixed positioning, täcker hela viewport
   * - flex items-center justify-center: Centrerar innehåll (både horisontellt och vertikalt)
   * - bg-neutral-950: Mycket mörk bakgrund
   * - bg-opacity-70: 70% opacitet för semi-transparent overlay
   * - z-50: Högt z-index för att ligga över allt annat innehåll
   *
   * Purpose:
   * - Blockar användarinteraktion medan något laddas
   * - Ger visuell feedback att något händer
   * - Darkens bakgrunden för bättre kontrast med spinner
   */
  <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-70 z-50">
    {/**
     * Spinner container: Wrapper för de roterande ringarna
     *
     * Classes:
     * - w-16 h-16: Fast storlek 64px x 64px
     * - rounded-full: Gör container rund (matchar ringarna)
     * - animate-spin: Standard React rotation-animation
     * - relative: Positioneringskontext för absolut positionerade ringar
     *
     * Purpose:
     * - Grupperar de två ringarna
     * - Ger en bas-rotation (även om ringarna har egna rotationer)
     */}
    <div className="w-16 h-16 rounded-full animate-spin relative">
      {/**
       * Ring 1: Cyan/pink roterande ring
       *
       * Classes:
       * - absolute inset-0: Täcker hela parent (64px x 64px)
       * - rounded-full: Perfekt cirkel
       * - border-4: 4px bred border
       * - border-cyan-400: Cyan färg för huvudborder
       * - border-t-pink-500: Pink färg för top-border (skapar gradient-effekt)
       * - animate-spin-slow: Custom långsam rotation (1.8s per varv)
       *
       * Effect:
       * - Roterar långsamt medurs
       * - Gradient från cyan till pink
       */}
      <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-pink-500 animate-spin-slow" />

      {/**
       * Ring 2: Purple/green roterande ring
       *
       * Classes:
       * - absolute inset-0: Samma position som Ring 1 (överlappar)
       * - rounded-full: Perfekt cirkel
       * - border-4: 4px bred border
       * - border-purple-500: Purple färg för huvudborder
       * - border-t-green-400: Green färg för top-border
       * - animate-spin-reverse: Custom reverse rotation (1.5s per varv)
       *
       * Effect:
       * - Roterar moturs (motsatt Ring 1)
       * - Gradient från purple till green
       * - Skapar hypnotisk dubbel-rotations-effekt tillsammans med Ring 1
       *
       * Combined effect:
       * - Två ringar roterar i motsatta riktningar
       * - Olika hastigheter skapar dynamisk visuell effekt
       * - Färgerna blandas visuellt för intressant look
       */}
      <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-green-400 animate-spin-reverse" />
    </div>
  </div>
);

export default Spinner;
