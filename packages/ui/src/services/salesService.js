import { ENDPOINT } from "./endpoint";

export const fetchCustomerVouchers = async (customerId) => {
  try {
    const response = await fetch(`${ENDPOINT}/customer/${customerId}/voucher`, {
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
    const response = await fetch(`${ENDPOINT}/voucher/${voucherId}`, {
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

export const fetchSaleDetails = async (saleId) => {
  try {
    const response = await fetch(`${ENDPOINT}/sale/${saleId}`, {
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
