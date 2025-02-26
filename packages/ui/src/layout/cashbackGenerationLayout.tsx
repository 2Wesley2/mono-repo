import React, { FC } from 'react';
import { TierList } from '../components/TierList/TierList';

export const GenerateCashback: FC = () => {
  return (
    <div className="flex flex-row h-full w-full">
      <TierList />
    </div>
  );
};
