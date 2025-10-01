import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFile } from '@components/Upload';
import { Spinner, BoxesContainer } from '@components/Ui';
import type { SheetData } from '@types';
import { motion } from 'framer-motion';

interface HomePageProps {
  onDataParsed: (parsedSheets: SheetData, fileName: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onDataParsed }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative w-full overflow-hidden bg-neutral-950 flex flex-col items-center justify-center rounded-lg">
      {/* Bakgrunds-overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 w-full h-full bg-neutral-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"
      />

      {/* Pulserande boxgrid */}
      <BoxesContainer />

      {/* Upload-kort */}
      <React.Suspense fallback={<Spinner />}>
        {/* H1 med neon-glow */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="cursor-none font-grand-hotel text-9xl md:text-5xl font-extrabold text-white mb-6 text-center"
          style={{
            textShadow: '0 0 8px #0ff, 0 0 12px #0ff, 0 0 16px #0ff',
          }}
        >
          <h1>SavvySheet</h1>
        </motion.div>

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
          className="backdrop-blur-xl shadow-2xl rounded-xl flex flex-col items-center border border-white/10 relative z-30"
        >
          {/* Upload komponent */}
          <UploadFile
            onDataParsed={(parsedSheets: SheetData, fileName: string) => {
              onDataParsed(parsedSheets, fileName);
              navigate('/sheet');
            }}
          />
        </motion.div>
      </React.Suspense>
    </div>
  );
};

export default HomePage;
