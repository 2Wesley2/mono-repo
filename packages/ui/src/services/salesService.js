const API_URL = "https://api.fakeurl.com/sales";

export const registerSaleWithoutCashback = async (saleData) => {
  try {
    const response = await fetch(`${API_URL}/no-cashback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar venda sem cashback');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerSaleWithCashback = async (saleData) => {
  try {
    const response = await fetch(`${API_URL}/with-cashback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar venda com cashback');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
