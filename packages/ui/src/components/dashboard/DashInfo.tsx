import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DashboardInfoProps {
  totalSales: number;
  averageTicket: number;
  topProduct: string;
}

export const DashboardInfo: React.FC<DashboardInfoProps> = ({ totalSales, averageTicket, topProduct }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Médio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">R$ {averageTicket.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produto Mais Vendido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{topProduct}</p>
        </CardContent>
      </Card>
    </div>
  );
};
