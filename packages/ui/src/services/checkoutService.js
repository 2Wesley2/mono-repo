import { ENDPOINT } from './endpoint';
export const getCustomers = async () => {
  try {
    const response = await fetch(`${ENDPOINT}/customer`, {
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
    const response = await fetch(`${ENDPOINT}/voucher/customer/${customerId}/vouchers`, {
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

export const createSale = async (saleData) => {
  try {
    const response = await fetch(`${ENDPOINT}/sale`, {
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
