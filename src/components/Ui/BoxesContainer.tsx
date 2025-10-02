import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const BoxesContainer = () => {
  const rows = 12;
  const cols = 20;
  const totalBoxes = rows * cols;

  const [activeBox, setActiveBox] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBox(Math.floor(Math.random() * totalBoxes));
    }, 2000);
    return () => clearInterval(interval);
  }, [totalBoxes]);

  return (
    <div className="absolute inset-0 flex flex-col z-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="flex flex-1 w-full">
          {Array.from({ length: cols }).map((_, j) => {
            const index = i * cols + j;
            const isActive = index === activeBox;
            return (
              <motion.div
                key={`col-${j}`}
                animate={{
                  backgroundColor: isActive ? '#ffffff' : '#0f172a',
                  opacity: isActive ? 0.14 : 0.15,
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
                className="flex-1 border opacity-20 border-slate-950 rounded-sm"
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
