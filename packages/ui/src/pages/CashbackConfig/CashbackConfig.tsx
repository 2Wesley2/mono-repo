import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import { ToggleButton } from '../../components/cashback/ToggleButton';
import { Tabs } from '../../components/cashback/Tabs';
import { GenerateCashback } from '../../layout/cashbackGenerationLayout';

export const CashbackConfigPage: React.FC = () => {
  const tabs = [
    { label: 'Geração', content: <GenerateCashback /> },
    { label: 'Utilização', content: <p>Conteúdo do Condição</p> }
  ];

  return (
    <div className="flex flex-1 flex-row h-[100vh] min-h-screen max-h-screen bg-background text-foreground">
      <NavBar />
      <main className="flex flex-col flex-1 w-full h-full">
        <header className="w-full flex-[0_1_auto] justify-center p-4"></header>
        <div className="container mx-auto p-4">
          <ToggleButton label="Cashback" />
        </div>
        <summary className="w-full flex-[0_1_auto] justify-center">
          <h2 className="text-4xl font-thin">Condições</h2>
        </summary>
        <section className="flex-1 w-full min-h-0 overflow-hidden">
          <Tabs tabs={tabs} />
        </section>
      </main>
    </div>
  );
};
