import { useEffect, useState } from 'react';
import { getCustomerTickets } from '../service/index';

const TicketList = ({ cpf, onSelectTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketsData = await getCustomerTickets(cpf);
        setTickets(ticketsData);
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (cpf) fetchTickets();
  }, [cpf]);

  if (loading) return <p>Carregando tickets...</p>;

  return (
    <div>
      <h2>Tickets para CPF: {cpf}</h2>
      {tickets.length === 0 ? (
        <p>Nenhum ticket disponível para este cliente.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id} onClick={() => onSelectTicket(ticket)}>
              Ticket ID: {ticket._id} - Status: {ticket.status} - Desconto: {ticket.discount}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketList;
