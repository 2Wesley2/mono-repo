import React from 'react';
import { useState } from 'react';
import { Trophy, FileText, Share2, Mail } from 'lucide-react';
import './Dashboard.css';
import NavBar from '../../components/NavBar/NavBar';
import { MetricsCards } from '../../components/dashboard/MetricCards';
import { CommandasGraph } from '../../components/dashboard/ComandGraph';
import { DashboardInfo } from '../../components/dashboard/DashInfo';
import ConfirmationModal from '../../components/dashboard/ConfirmationCard';

const DashboardPage: React.FC = () => {
  const [IsConfirmCardOpen, setIsConfirmCardOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed');
    setIsConfirmCardOpen(false);
    // logica para adicionar a comanda
  };
  const handleCancel = () => {
    console.log('Cancelled');
    setIsConfirmCardOpen(false);
  };
  const [metrics] = useState({
    openCommandas: 5,
    totalCommandas: 150
  });

  const [dashboardInfo] = useState({
    totalSales: 15000.5,
    averageTicket: 100.25,
    topProduct: 'Hambúrguer Clássico'
  });

  const handleCreateComanda = () => {
    setIsConfirmCardOpen(true);
    console.log('Criar nova comanda');
  };

  return (
    <div className="row-page">
      <NavBar />
      <main className="mainContent-dash">
        <div className="flex items-center justify-between mb-8">
          <div className="greetingContainer">
            <h1 className="text-3xl font-bold">Olá, Borderless</h1>
          </div>
        </div>

        <MetricsCards
          openCommandas={metrics.openCommandas}
          totalCommandas={metrics.totalCommandas}
          onCreateComanda={handleCreateComanda}
        />

        <div className="mb-8">
          <CommandasGraph />
        </div>

        <div className="mb-8">
          <DashboardInfo
            totalSales={dashboardInfo.totalSales}
            averageTicket={dashboardInfo.averageTicket}
            topProduct={dashboardInfo.topProduct}
          />
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Atalhos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Trophy,
                label: 'Prêmios',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: FileText,
                label: 'Extrato',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: Share2,
                label: 'Indique Amigos',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: Mail,
                label: 'Contato',
                color: 'bg-red-100 text-red-600'
              }
            ].map((item, index) => (
              <div key={index} className="cardButton">
                <div className={`p-4 rounded-full ${item.color} mb-3`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal de confirmação */}
      <ConfirmationModal isOpen={IsConfirmCardOpen} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default DashboardPage;
