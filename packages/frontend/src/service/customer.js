import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/customer/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCustomerTickets = async (cpf) => {
  try {
    const response = await fetch(`${apiBaseUrl}/customer/${cpf}/tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar tickets do cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addCustomer = async (customerData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editCustomer = async (id, customerData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error('Erro ao editar cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir cliente');
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
