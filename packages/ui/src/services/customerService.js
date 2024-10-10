const API_URL = "http://localhost:3001/api/customer";

export const getCustomers = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
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

export const addCustomer = async (customerData) => {
  try {
    const response = await fetch(`${API_URL}`, {
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
    const response = await fetch(`${API_URL}/${id}`, {
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verifica se a resposta é bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao excluir cliente');
    }

    // Se o status for 204 (sem conteúdo), não tenta fazer o parse do JSON
    if (response.status === 204) {
      return null; // Retorna null para indicar que a exclusão foi bem-sucedida sem resposta
    }

    // Caso contrário, tenta fazer o parse do JSON
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

