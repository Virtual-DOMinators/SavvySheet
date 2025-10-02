import { useEffect, useState, memo } from 'react';

const rows = 12;
const cols = 20;
const totalBoxes = rows * cols;

// Memoized Box
const Box = memo(({ active }: { active: boolean }) => (
  <div
    style={{
      backgroundColor: active ? '#ffffff' : '#0f172a',
      opacity: active ? 0.14 : 0.15,
    }}
    className="flex-1 border opacity-20 border-slate-950 rounded-sm transition-colors duration-1000 ease-in-out"
  />
));

export const BoxesContainer = () => {
  const [activeBox, setActiveBox] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBox(Math.floor(Math.random() * totalBoxes));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col z-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex flex-1 w-full">
          {Array.from({ length: cols }).map((_, j) => {
            const index = i * cols + j;
            return <Box key={j} active={index === activeBox} />;
          })}
        </div>
      ))}
    </div>
  );
};

export default BoxesContainer;
