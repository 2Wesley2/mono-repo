import React, { useState } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { ToggleButton } from '../../components/cashback/ToggleButton';
import { Tabs } from '../../components/cashback/Tabs';
import { TierList } from '../../components/cashback/TierList';

export const CashbackConfigPage: React.FC = () => {
  const [tiers, setTiers] = useState([{ id: 1, minValue: 0, creditValue: 0 }]);

  const tabs = [
    { label: 'Geração', content: <TierList tiers={tiers} setTiers={setTiers} /> },
    { label: 'Condição', content: <p>Conteúdo do Condição</p> }
  ];

  return (
    <div className="flex flex-row min-h-screen max-h-screen bg-background text-foreground">
      <NavBar />
      <main className="flex flex-col w-full text-foreground">
        <header className="w-full flex justify-center p-4">
          <h1 className="text-4xl font-normal uppercase mb-4">Configuração de Cashback</h1>
        </header>
        <div className="container mx-auto p-4">
          <ToggleButton label="Cashback" />
        </div>
        <summary className="flex w-full justify-center">
          <h2 className="text-4xl font-thin">Condições</h2>
        </summary>
        <section>
          <Tabs tabs={tabs} />
        </section>
      </main>
    </div>
  );
};
