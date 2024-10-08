import React, { useState } from 'react';
import { registerSaleWithCashback } from '../services/salesService';

const SaleConfirmation2 = () => {
  const [cpf, setCpf] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [cashbackUsed, setCashbackUsed] = useState('');
  const [finalAmount, setFinalAmount] = useState(null);

  const handleRegisterSale = async () => {
    try {
      const saleData = { cpf, totalAmount, cashbackUsed };
      const response = await registerSaleWithCashback(saleData);
      const discountedAmount = totalAmount - cashbackUsed;
      setFinalAmount(discountedAmount);
      alert('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda.');
    }
  };

  return (
    <div>
      <h1>Confirmação de Venda Com Cashback</h1>
      <input
        type="text"
        placeholder="CPF do Cliente"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor Total da Compra"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor do Cashback"
        value={cashbackUsed}
        onChange={(e) => setCashbackUsed(e.target.value)}
      />
      <button onClick={handleRegisterSale}>Registrar Venda</button>
      
      {finalAmount !== null && (
        <p>Valor final com desconto: R$ {finalAmount}</p>
      )}
    </div>
  );
};

export default SaleConfirmation2;
