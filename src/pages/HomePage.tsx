import React, { useCallback, useState, useEffect, Suspense, lazy, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFile } from '@components/Upload';
import type { SheetData } from '@types';
import { motion } from 'framer-motion';

const BoxesContainer = memo(lazy(() => import('@components/Ui/BoxesContainer')));

type HomePageProps = {
  onDataParsed: (parsedSheets: SheetData, fileName: string) => void;
};

const titleMotion = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.7 },
};

const HomePage: React.FC<HomePageProps> = ({ onDataParsed }) => {
  const navigate = useNavigate();
  const [showBoxes, setShowBoxes] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowBoxes(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleDataParsed = useCallback(
    (parsedSheets: SheetData, fileName: string) => {
      onDataParsed(parsedSheets, fileName);
      navigate('/sheet');
    },
    [onDataParsed, navigate],
  );

  return (
    <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center relative overflow-hidden rounded-lg">
      <motion.div
        className="absolute inset-0 w-full h-full bg-neutral-900 z-20 pointer-events-none will-change-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      />

      {showBoxes && (
        <div className="absolute inset-0 z-10">
          <Suspense fallback={<div className="absolute inset-0 bg-neutral-900 opacity-10" />}>
            <BoxesContainer />
          </Suspense>
        </div>
      )}

      <div className="flex flex-col items-center justify-center w-full h-full min-h-screen gap-12 relative z-30">
        <motion.div {...titleMotion} className="mt-16 mb-2">
          <h1
            className="font-grand-hotel text-5xl sm:text-7xl md:text-9xl font-extrabold text-white text-center"
            style={{ textShadow: '0 0 8px #0ff, 0 0 12px #0ff, 0 0 16px #0ff' }}
          >
            SavvySheet
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40, boxShadow: '0px 0px 0px rgba(0,255,180,0)' }}
          animate={{ opacity: 1, scale: 1, y: 0, boxShadow: '0px 0px 0px rgba(0,255,180,0)' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
          className="flex justify-center"
        >
          <UploadFile onDataParsed={handleDataParsed} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
