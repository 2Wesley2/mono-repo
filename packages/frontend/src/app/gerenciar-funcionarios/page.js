'use client';
import React, { useState, useCallback, useMemo } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import EmployeeTable from '../../components/EmployeeTable';
import EmployeeDialog from '../../components/EmployeeDialog';
import useDebounce from '../../hooks/useDebounce';
import { addEmployee, editEmployee, deleteEmployee } from '../../service/fetch';

const EmployeeManagement = ({ serverEmployees = [] }) => {
  console.log('renderizando employee no client')

  const [employees, setEmployees] = useState(serverEmployees || []);
  const [dialogState, setDialogState] = useState({ type: null, employee: null });
  const [searchQuery, setSearchQuery] = useState('');

  const debounceSearch = useDebounce(searchQuery, 300);

  const handleAddEmployee = useCallback(async (newEmployee) => {
    const addedEmployee = await addEmployee(newEmployee);
    setEmployees((prev) => [...prev, addedEmployee]);
    setDialogState({ type: null, employee: null });
  }, []);

  const handleEditEmployee = useCallback(async (editedEmployee) => {
    const updatedEmployee = await editEmployee(editedEmployee._id, editedEmployee);
    setEmployees((prev) => prev.map((emp) => (emp._id === updatedEmployee._id ? updatedEmployee : emp)));
    setDialogState({ type: null, employee: null });
  }, []);

  const handleDeleteEmployee = useCallback(async (employeeToDelete) => {
    await deleteEmployee(employeeToDelete._id);
    setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete._id));
    setDialogState({ type: null, employee: null });
  }, []);

  const filteredEmployees = useMemo(() =>
    employees.filter((employee) =>
      employee.name.toLowerCase().includes(debounceSearch.toLowerCase())
    ), [employees, debounceSearch]
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          gap: 3,
        }}
      >
        <TextField
          label="Pesquisar Funcionário"
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ width: '300px' }}
          aria-label="Campo de pesquisa de funcionários"
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: '8px' }}
          onClick={() => setDialogState({ type: 'register', employee: { name: '', number: '' } })}
        >
          Registrar Funcionário
        </Button>
      </Box>
      {employees.length === 0 ? (
        <p>Nenhum funcionário cadastrado ainda</p>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onEdit={(employee) => setDialogState({ type: 'edit', employee })}
          onDelete={(employee) => setDialogState({ type: 'delete', employee })}
        />
      )}

      <EmployeeDialog
        open={dialogState.type === 'register'}
        onClose={() => setDialogState({ type: null, employee: null })}
        onConfirm={handleAddEmployee}
        title="Registrar Novo Funcionário"
        initialData={dialogState.employee}
      />

      <EmployeeDialog
        open={dialogState.type === 'edit'}
        onClose={() => setDialogState({ type: null, employee: null })}
        onConfirm={handleEditEmployee}
        title="Editar Funcionário"
        initialData={dialogState.employee}
      />

      <Dialog open={dialogState.type === 'delete'} onClose={() => setDialogState({ type: null, employee: null })}>
        <DialogTitle>Confirmação de Exclusão</DialogTitle>
        <DialogContent>
          <p>Você tem certeza que deseja excluir o funcionário {dialogState.employee?.name || ''}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogState({ type: null, employee: null })}>Cancelar</Button>
          <Button onClick={() => handleDeleteEmployee(dialogState.employee)} variant="contained" color="secondary">Sim, excluir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(EmployeeManagement);
