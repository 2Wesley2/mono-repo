import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

export const getAllCashbacks = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/cashback/cashbacks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar cashbacks');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createCashback = async (cashbackData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cashback/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cashbackData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar cashback');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCashback = async (cashbackId, cashbackData) => {
  try {
    const response = await fetch(`${apiBaseUrl}/cashback/${cashbackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cashbackData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar cashback');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
