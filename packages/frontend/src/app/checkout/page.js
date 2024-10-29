// src/app/checkout/page.js

'use client';
import { useState } from 'react';
import CustomerList from '../../components/CustomerList';
import TicketList from '../../components/TicketList';
import SaleForm from '../../components/SaleForm';

const CheckoutPage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div>
      <CustomerList onSelectCustomer={(customer) => setSelectedCustomer(customer)} />
      {selectedCustomer && (
        <TicketList
          cpf={selectedCustomer.cpf}
          onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        />
      )}
      {selectedCustomer && (
        <SaleForm 
          cpf={selectedCustomer.cpf} 
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
