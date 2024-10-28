import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

// LOGIN
export async function login(username, password) {
  try {
    const res = await fetch(`${apiBaseUrl}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Erro no login: verifique suas credenciais.');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

// CUSTOMERS
export const getCustomer = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer`, {
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
    const response = await fetch(`${apiBaseUrl}/api/customer`, {
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

export const editCustomer = async (cpf, customerData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer/${cpf}`, {
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

export const deleteCustomer = async (cpf) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/customer/${cpf}`, {
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

// EMPLOYEES
export const getEmployees = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/employee`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar funcionários');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar funcionário');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editEmployee = async (id, employeeData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/employee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error('Erro ao editar funcionário');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/employee/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao excluir funcionário');
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// SALES
export const createSale = async (saleData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar venda');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
