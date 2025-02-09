import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const data = [
  { name: 'Seg', comandas: 4 },
  { name: 'Ter', comandas: 3 },
  { name: 'Qua', comandas: 5 },
  { name: 'Qui', comandas: 7 },
  { name: 'Sex', comandas: 9 },
  { name: 'Sáb', comandas: 12 },
  { name: 'Dom', comandas: 10 }
];

export const CommandasGraph: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Comandas nos Últimos 7 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="comandas" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
