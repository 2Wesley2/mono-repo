import React, { useState, useEffect } from 'react';
import { getCustomers, getVouchersByCustomer, createSale } from '../services/checkoutService';

const Checkout = () => {
  const [customers, setCustomers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null); // voucher opcional
  const [saleAmount, setSaleAmount] = useState(0);
  const [fuelType, setFuelType] = useState('gasolina'); // Tipo de combustível

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      const fetchVouchers = async () => {
        try {
          const vouchersData = await getVouchersByCustomer(selectedCustomerId);
          setVouchers(vouchersData);
          setSelectedVoucherId(null); // Resetar o voucher selecionado quando o cliente mudar
        } catch (error) {
          console.error('Erro ao buscar vouchers:', error);
        }
      };

      fetchVouchers();
    }
  }, [selectedCustomerId]);

  const handleCheckout = async () => {
    if (!saleAmount || saleAmount <= 0) {
      alert('O valor da venda deve ser maior que zero');
      return;
    }
  
    try {
      const saleData = {
        customerId: selectedCustomerId,
        voucherId: selectedVoucherId || null,
        amount: saleAmount,
        fuelType,
      };
  
      console.log('Objeto de venda:', saleData);
      console.log('Tipos dos dados:');
      console.log('customerId:', typeof saleData.customerId);
      console.log('voucherId:', typeof saleData.voucherId);
      console.log('amount:', typeof saleData.amount);
      console.log('fuelType:', typeof saleData.fuelType);
  
      await createSale(saleData);
      alert('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      alert('Erro ao registrar venda!');
    }
  };
  
  

  return (
    <div>
      <h2>Checkout de Venda</h2>

      <label>Selecione o Cliente:</label>
      <select
        value={selectedCustomerId || ''}
        onChange={(e) => setSelectedCustomerId(e.target.value)}
      >
        <option value="">Selecione</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer._id}>
            {customer.name}
          </option>
        ))}
      </select>

      {vouchers.length > 0 ? (
        <>
          <label>Selecione o Voucher (opcional):</label>
          <select
            value={selectedVoucherId || ''}
            onChange={(e) => setSelectedVoucherId(e.target.value)}
          >
            <option value="">Nenhum voucher</option>
            {vouchers.map((voucher) => (
              <option key={voucher._id} value={voucher._id}>
                {voucher.voucherValue ? `R$${voucher.voucherValue}` : `${voucher.discountPercentage}% de desconto`}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>Cliente não possui vouchers disponíveis.</p>
      )}

      <label>Valor da Venda:</label>
      <input
        type="number"
        value={saleAmount}
        onChange={(e) => setSaleAmount(parseFloat(e.target.value) || 0)}
      />

      <label>Tipo de Combustível:</label>
      <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
        <option value="gasolina">Gasolina</option>
        <option value="alcool">Álcool</option>
      </select>

      <button onClick={handleCheckout}>Finalizar Venda</button>
    </div>
  );
};

export default Checkout;
