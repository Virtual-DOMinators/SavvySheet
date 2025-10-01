import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFile } from '@components/Upload';
import { Spinner } from '@components/Ui';
import type { SheetData } from '@types';

interface HomePageProps {
  onDataParsed: (parsedSheets: SheetData, fileName: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onDataParsed }) => {
  const navigate = useNavigate();

  return (
    <React.Suspense fallback={<Spinner />}>
      <UploadFile
        onDataParsed={(parsedSheets: SheetData, fileName: string) => {
          onDataParsed(parsedSheets, fileName);
          navigate('/sheet');
        }}
      />
    </React.Suspense>
  );
};

export default HomePage;
