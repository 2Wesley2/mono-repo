'use client';
import { useState } from 'react';
import CustomerSelection from '../../components/customer/CustomerSelection';
import TicketSelection from '../../components/cashback/TicketSelection';
import SaleForm from '../../components/sale/SaleForm';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePreviousStep = () => setStep((prev) => prev - 1);

  return (
    <div>
      {step === 1 && (
        <CustomerSelection
          onSelectCustomer={(customer) => {
            setSelectedCustomer(customer);
            handleNextStep();
          }}
        />
      )}
      {step === 2 && selectedCustomer && (
        <TicketSelection
          customer={selectedCustomer}
          onSelectTicket={(ticket) => {
            setSelectedTicket(ticket);
            handleNextStep();
          }}
          onBack={handlePreviousStep}
          onNextWithoutTicket={() => {
            setSelectedTicket(null);
            handleNextStep();
          }}
        />
      )}
      {step === 3 && selectedCustomer && (
        <SaleForm
          cpf={selectedCustomer.cpf}
          ticket={selectedTicket}
          onBack={handlePreviousStep}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
