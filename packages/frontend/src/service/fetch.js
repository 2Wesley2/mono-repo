import env from '../env/index'

const apiBaseUrl = env.apiBaseUrl;
console.log("API Base URL (fetch.js):", apiBaseUrl);

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
export const getCustomers = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/customer`, {
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

export const getVouchersByCustomer = async (customerId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/voucher/customer/${customerId}/vouchers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar vouchers do cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// SALES
export const createSale = async (saleData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/sale`, {
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

export const fetchCustomerVouchers = async (customerId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/customer/${customerId}/voucher`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar vouchers');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchVoucherDetails = async (voucherId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/voucher/${voucherId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes do voucher');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const submitSale = async (saleData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/sale`, {
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

export const fetchSaleDetails = async (saleId) => {
  try {
    const response = await fetch(`${apiBaseUrl}/sale/${saleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da venda');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}`, {
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
    const response = await fetch(`${apiBaseUrl}`, {
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
    const response = await fetch(`${apiBaseUrl}/${id}`, {
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
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
   
    if (response.ok) {
      return;
    } else {
      throw new Error('Erro ao excluir funcionário');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const getCustomer = async () => {
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

