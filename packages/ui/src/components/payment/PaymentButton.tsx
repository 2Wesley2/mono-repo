import React from 'react';
import './PaymentButton.css';

interface PaymentButtonProps {
  total: number;
  onPaymentComplete: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ total, onPaymentComplete }) => {
  const handlePayment = async () => {
    try {
      // Lógica para gerar o deeplink da Getnet
      const getnetDeeplink = `getnet://payment?amount=${total.toFixed(2)}&method=credit`;

      // Simula o processo de pagamento
      // Na implementação real, vamos abrir o deeplink e aguardar o retorno
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simula um pagamento bem-sucedido
      onPaymentComplete();
      alert('Pagamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      alert('Erro ao processar o pagamento. Por favor, tente novamente.');
    }
  };

  return (
    <button onClick={handlePayment} className="payment-button">
      Pagar com Getnet (R$ {total.toFixed(2)})
    </button>
  );
};

export default PaymentButton;
