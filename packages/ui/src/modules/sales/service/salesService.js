const API_BASE_URL = process.env.NEXT_PUBLIC_SALES_API_BASE_URL;

export const getSaleById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter a venda');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};

export const getAllSales = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter as vendas');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};

export const createSale = async (salesData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(salesData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar a venda');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};
