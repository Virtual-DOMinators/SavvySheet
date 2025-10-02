import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFile } from '@components/Upload';
import { Spinner, BoxesContainer } from '@components/Ui';
import type { SheetData } from '@types';
import { motion } from 'framer-motion';

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full bg-neutral-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"
      />
      <BoxesContainer />

      <React.Suspense fallback={<Spinner />}>
        {/* Ingen extra wrapper, bara flex och gap */}
        <div className="flex flex-col items-center justify-center w-full h-full min-h-screen gap-12 relative z-30">
          {/* H1 högre upp med margin */}
          <motion.div {...titleMotion} className="mt-16 mb-2">
            <h1
              className="font-grand-hotel text-5xl sm:text-7xl md:text-9xl font-extrabold text-white text-center"
              style={{
                textShadow: '0 0 8px #0ff, 0 0 12px #0ff, 0 0 16px #0ff',
              }}
            >
              SavvySheet
            </h1>
          </motion.div>
          {/* Drag/drop centrerad */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              delay: 0.5,
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 0px 25px rgba(0,255,180,0.2)',
            }}
            className="flex justify-center"
          >
            <UploadFile onDataParsed={handleDataParsed} />
          </motion.div>
        </div>
      </React.Suspense>
    </div>
  );
};

export default HomePage;
