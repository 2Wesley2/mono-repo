import { useState, useEffect } from 'react';
import { createSale } from '../service/index';

const SaleForm = ({ cpf, ticket }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const discount = ticket ? ticket.discount : 0;
    const discountedAmount = totalAmount * (1 - discount / 100);
    setFinalAmount(discountedAmount);
  }, [totalAmount, ticket]);

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const saleData = {
        clientCPF: cpf,
        ticketId: ticket ? ticket._id : null,
        totalAmount,
        finalAmount,
      };
      const result = await createSale(saleData);
      alert(`Venda realizada! Valor final: ${result.finalAmount}`);
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaleSubmit}>
      <h2>Finalizar Venda</h2>
      <label>
        Valor Total:
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(Number(e.target.value))}
          required
        />
      </label>

      {ticket && <p>Desconto aplicado: {ticket.discount}%</p>}
      <p>Valor Final: {finalAmount.toFixed(2)}</p>

      <button type="submit" disabled={loading}>
        {loading ? 'Processando...' : 'Finalizar Venda'}
      </button>
    </form>
  );
};

export default SaleForm;
