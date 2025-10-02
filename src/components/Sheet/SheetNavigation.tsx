interface SheetNavigationProps {
  currentIdx: number;
  maxIdx: number;
  onPrev: () => void;
  onNext: () => void;
}

function SheetNavigation({ currentIdx, maxIdx, onPrev, onNext }: SheetNavigationProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button onClick={onPrev} disabled={currentIdx === 0} className="btn btn-outline">
        Föregående
      </button>
      <button onClick={onNext} disabled={currentIdx === maxIdx} className="btn btn-outline">
        Nästa
      </button>
    </div>
  );
}

export default SheetNavigation;
