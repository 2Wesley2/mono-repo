const API_URL = "http://localhost:3001/api/employee";

export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
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
    const response = await fetch(`${API_URL}`, {
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
    const response = await fetch(`${API_URL}/${id}`, {
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
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
   
    if (response.ok) {
      return;
    } else {
      throw new Error('Erro ao excluir funcionário');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
