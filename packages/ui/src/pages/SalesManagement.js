import React from 'react';
import { useNavigate } from 'react-router-dom';

const SalesManagement = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Gerenciamento de Vendas</h1>
      <div>
        <h2>Opções</h2>
        <button onClick={() => navigate('/confirmar-venda-1')}>
          Sem Cashback
        </button>
        <button onClick={() => navigate('/confirmar-venda-2')}>
          Com Cashback
        </button>
      </div>
    </div>
  );
};

export default SalesManagement;
