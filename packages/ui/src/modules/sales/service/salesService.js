const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getSaleById = async (id) => {
  console.log(`[getSaleById] Fetching sale with ID: ${id} from ${API_BASE_URL}/api/sales/${id}`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/sales/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[getSaleById] Error: Failed to fetch sale. Status: ${response.status}`);
      throw new Error('Erro ao obter a venda');
    }

    const sale = await response.json();
    console.log(`[getSaleById] Sale fetched successfully. Data: ${JSON.stringify(sale)}`);
    return sale;
  } catch (error) {
    console.error(`[getSaleById] Fetch error: ${error.message}`);
    throw error;
  }
};

export const getAllSales = async () => {
  console.log(`[getAllSales] Fetching all sales from ${API_BASE_URL}/api/sales`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/sales`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[getAllSales] Error: Failed to fetch sales. Status: ${response.status}`);
      throw new Error('Erro ao obter as vendas');
    }

    const sales = await response.json();
    console.log(`[getAllSales] Sales fetched successfully. Data: ${JSON.stringify(sales)}`);
    return sales;
  } catch (error) {
    console.error(`[getAllSales] Fetch error: ${error.message}`);
    throw error;
  }
};

export const createSale = async (saleData) => {
  console.log(`[createSale] Creating sale with data: ${JSON.stringify(saleData)} at ${API_BASE_URL}/api/sales`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      console.error(`[createSale] Error: Failed to create sale. Status: ${response.status}`);
      throw new Error('Erro ao criar a venda');
    }

    const createdSale = await response.json();
    console.log(`[createSale] Sale created successfully. Data: ${JSON.stringify(createdSale)}`);
    return createdSale;
  } catch (error) {
    console.error(`[createSale] Fetch error: ${error.message}`);
    throw error;
  }
};

export const updateSale = async (id, saleData) => {
  console.log(
    `[updateSale] Updating sale with ID: ${id} with data: ${JSON.stringify(saleData)} at ${API_BASE_URL}/api/sales/${id}`,
  );

  try {
    const response = await fetch(`${API_BASE_URL}/api/sales/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });

    if (!response.ok) {
      console.error(`[updateSale] Error: Failed to update sale. Status: ${response.status}`);
      throw new Error('Erro ao atualizar a venda');
    }

    const updatedSale = await response.json();
    console.log(`[updateSale] Sale updated successfully. Data: ${JSON.stringify(updatedSale)}`);
    return updatedSale;
  } catch (error) {
    console.error(`[updateSale] Fetch error: ${error.message}`);
    throw error;
  }
};

export const deleteSale = async (id) => {
  console.log(`[deleteSale] Deleting sale with ID: ${id} from ${API_BASE_URL}/api/sales/${id}`);
  try {
    const response = await fetch(`${API_BASE_URL}/api/sales/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`[deleteSale] Error: Failed to delete sale. Status: ${response.status}`);
      throw new Error('Erro ao deletar a venda');
    }

    if (response.status === 204) {
      console.log('[deleteSale] Sale deleted successfully.');
      return { message: 'Venda deletada com sucesso.' };
    }

    const result = await response.json();
    console.log(`[deleteSale] Sale deleted successfully. Result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`[deleteSale] Fetch error: ${error.message}`);
    throw error;
  }
};
