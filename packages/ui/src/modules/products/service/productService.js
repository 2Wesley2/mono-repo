const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getProductById = async (id) => {
  console.log(`[getProductById] Fetching product with ID: ${id} from ${API_BASE_URL}/api/products/${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[getProductById] Error: Failed to fetch product. Status: ${response.status}`);
      throw new Error('Erro ao obter o produto');
    }

    const product = await response.json();
    console.log(`[getProductById] Product fetched successfully. Data: ${JSON.stringify(product)}`);
    return product;
  } catch (error) {
    console.error(`[getProductById] Fetch error: ${error.message}`);
    throw error;
  }
};

export const getAllProducts = async () => {
  console.log(`[getAllProducts] Fetching all products from ${API_BASE_URL}/api/products`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[getAllProducts] Error: Failed to fetch products. Status: ${response.status}`);
      throw new Error('Erro ao obter os produtos');
    }

    const products = await response.json();
    console.log(`[getAllProducts] Products fetched successfully. Data: ${JSON.stringify(products)}`);
    return products;
  } catch (error) {
    console.error(`[getAllProducts] Fetch error: ${error.message}`);
    throw error;
  }
};

export const createProduct = async (productData) => {
  console.log(
    `[createProduct] Creating product with data: ${JSON.stringify(productData)} at ${API_BASE_URL}/api/products`,
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      console.error(`[createProduct] Error: Failed to create product. Status: ${response.status}`);
      throw new Error('Erro ao criar o produto');
    }

    const createdProduct = await response.json();
    console.log(`[createProduct] Product created successfully. Data: ${JSON.stringify(createdProduct)}`);
    return createdProduct;
  } catch (error) {
    console.error(`[createProduct] Fetch error: ${error.message}`);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  console.log(
    `[updateProduct] Updating product with ID: ${id} with data: ${JSON.stringify(productData)} at ${API_BASE_URL}/api/products/${id}`,
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      console.error(`[updateProduct] Error: Failed to update product. Status: ${response.status}`);
      throw new Error('Erro ao atualizar o produto');
    }

    const updatedProduct = await response.json();
    console.log(`[updateProduct] Product updated successfully. Data: ${JSON.stringify(updatedProduct)}`);
    return updatedProduct;
  } catch (error) {
    console.error(`[updateProduct] Fetch error: ${error.message}`);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  console.log(`[deleteProduct] Deleting product with ID: ${id} from ${API_BASE_URL}/api/products/${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[deleteProduct] Error: Failed to delete product. Status: ${response.status}`);
      throw new Error('Erro ao deletar o produto');
    }

    if (response.status === 204) {
      console.log('[deleteProduct] Product deleted successfully.');
      return { message: 'Produto deletado com sucesso.' };
    }

    const result = await response.json();
    console.log(`[deleteProduct] Product deleted successfully. Result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`[deleteProduct] Fetch error: ${error.message}`);
    throw error;
  }
};
