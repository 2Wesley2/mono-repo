import React from 'react';
import { Typography, Box } from '@mui/material';
import { getEmployees } from '../../service/fetch';

export const metadata = {
  title: 'Gerenciamento de Funcionários',
  description: 'Administre os dados dos funcionários da sua empresa.',
};

const EmployeeManagementLayout = async ({ children }) => {
  console.log('renderizando employee no server')
  let employees = [];
  try {
    employees = await getEmployees();
  } catch (error) {
    console.error("Failed to load employees:", error);
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '10vh',
        }}
      >
        <Typography variant="h4" component="h1">
          Gerenciamento de Funcionários
        </Typography>
      </Box>
      {React.cloneElement(children, { serverEmployees: employees })}
    </Box>
  );
};

export default EmployeeManagementLayout;
