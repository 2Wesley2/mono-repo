import { useEffect, useState } from 'react';
import { getAllCustomers } from '../service/index';

const CustomerList = ({ onSelectCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Carregando clientes...</p>;

  return (
    <div>
      <h2>Lista de Clientes</h2>
      {customers.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer.cpf} onClick={() => onSelectCustomer(customer)}>
              {customer.name} - CPF: {customer.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerList;
