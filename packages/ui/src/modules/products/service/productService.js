const API_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL;

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter o produto');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar o produto');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar o produto');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar o produto');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error.message);
    throw error;
  }
};
