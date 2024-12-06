import env from '../env/index';

const apiBaseUrl = env.apiBaseUrl;

export const getEmployees = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/employee`, {
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
    const response = await fetch(`${apiBaseUrl}/employee`, {
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
    const response = await fetch(`${apiBaseUrl}/employee/${id}`, {
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
    const response = await fetch(`${apiBaseUrl}/employee/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Erro ao excluir funcionário');
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
