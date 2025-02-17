import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { ToggleButton } from '../../components/cashback/ToggleButton';
import { Tabs } from '../../components/cashback/Tabs';
import { TierList } from '../../components/TierList';

export const CashbackConfigPage: React.FC = () => {
  const tabs = [
    { label: 'Geração', content: <TierList /> },
    { label: 'Utilização', content: <p>Conteúdo do Condição</p> }
  ];

  return (
    <div className="flex flex-row min-h-screen max-h-screen bg-background text-foreground">
      <NavBar />
      <main className="flex flex-col flex-1 w-full text-foreground">
        <header className="w-full flex justify-center p-4"></header>
        <div className="container mx-auto p-4">
          <ToggleButton label="Cashback" />
        </div>
        <summary className="flex w-full justify-center">
          <h2 className="text-4xl font-thin">Condições</h2>
        </summary>
        <section className="flex flex-col flex-1 min-h-0">
          <Tabs tabs={tabs} />
        </section>
      </main>
    </div>
  );
};
