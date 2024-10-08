import React, { useState } from 'react';
import { registerSaleWithoutCashback } from '../services/salesService';

const SaleConfirmation1 = () => {
  const [cpf, setCpf] = useState('');
  const [amount, setAmount] = useState('');

  const handleRegisterSale = async () => {
    try {
      const saleData = { cpf, amount };
      const response = await registerSaleWithoutCashback(saleData);
      alert('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda.');
    }
  };

  return (
    <div>
      <h1>Confirmação de Venda Sem Cashback</h1>
      <input
        type="text"
        placeholder="CPF do Cliente"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor da Compra"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleRegisterSale}>Registrar Venda</button>
    </div>
  );
};

export default SaleConfirmation1;
