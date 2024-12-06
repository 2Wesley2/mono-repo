import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

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
