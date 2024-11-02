'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Snackbar,
  TextField,
  Dialog, DialogTitle, DialogContent, Stack, Card, FormControl, DialogActions
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import useDebounce from '../../hooks/useDebounce';
import { addEmployee, editEmployee, deleteEmployee } from '../../service/fetch';
import Title from '../../components/Title';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', number: '' });
  const [dialogState, setDialogState] = useState({ type: null, employee: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const debounceSearch = useDebounce(searchQuery, 300);

  const loadEmployees = async () => {
    try {
      const employeeList = await getAllEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleOpenDialog = (type, employee = null) => {
    setDialogState({ type, employee });
    setNewEmployee(employee || { name: '', number: '' });
  };

  const handleCloseDialog = () => {
    setDialogState({ type: null, employee: null });
    setFormErrors({});
  };

  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!newEmployee.name) errors.name = { error: true, message: 'Nome é obrigatório' };
    if (!newEmployee.number) errors.number = { error: true, message: 'Número é obrigatório' };
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const addedEmployee = await addEmployee(newEmployee);
      setEmployees((prev) => [...prev, addedEmployee]);
      handleCloseDialog();
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao registrar funcionário:', error);
    }
  }, [newEmployee]);

  const handleEditEmployee = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const updatedEmployee = await editEmployee(dialogState.employee._id, newEmployee);
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === updatedEmployee._id ? updatedEmployee : emp))
      );
      handleCloseDialog();
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao editar funcionário:', error);
    }
  }, [newEmployee, dialogState.employee]);

  const handleDeleteEmployee = useCallback(async (employeeToDelete) => {
    try {
      await deleteEmployee(employeeToDelete._id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete._id));
      handleSnackbarOpen();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
    }
  }, []);

  const handleSubmit = () => (dialogState.type === 'add' ? handleAddEmployee() : handleEditEmployee());

  const filteredEmployees = useMemo(() =>
    employees.filter((employee) =>
      employee.name.toLowerCase().includes(debounceSearch.toLowerCase())
    ), [employees, debounceSearch]
  );

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="space-between" my={3}>

        <Title>
          Gerenciamento de Funcionários
        </Title>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#E50914',
            color: '#FFFFF',
            '&:hover': { backgroundColor: '#b71c1c' },
            fontSize: 'large'
          }}>
          Registrar Funcionário
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="Pesquisar Funcionário"
          variant="outlined"
          color='error'
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          sx={{ width: '300px' }}
          aria-label="Campo de pesquisa de funcionários"
        />
      </Box>

      {employees.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            fontStyle: 'italic',
            textAlign: 'center',
          }}
        >
          Não há funcionários cadastrados.
        </Typography>
      ) : (
        <DataTable
          headers={['Nome', 'Número']}
          dataKeys={['name', 'number']}
          data={filteredEmployees}
          handleEdit={(employee) => handleOpenDialog('edit', employee)}
          handleDelete={handleDeleteEmployee}
        />
      )}

      <Dialog open={dialogState.type !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {dialogState.type === 'add' ? 'Registrar Funcionário' : 'Editar Funcionário'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: 4,
                gap: 3,
                margin: 'auto',
                maxWidth: '500px',
                boxShadow: 3,
              }}
            >
              <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth>
                  <TextField
                    id="name"
                    label="Nome"
                    variant="outlined"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    error={formErrors.name?.error}
                    helperText={formErrors.name?.message}
                    fullWidth
                    required
                    color="error"
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    id="number"
                    label="Número"
                    variant="outlined"
                    value={newEmployee.number}
                    onChange={(e) => setNewEmployee({ ...newEmployee, number: e.target.value })}
                    error={formErrors.number?.error}
                    helperText={formErrors.number?.message}
                    fullWidth
                    required
                    color="error"
                  />
                </FormControl>
              </Box>
            </Card>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-around', padding: 2 }}>
          <Button onClick={handleSubmit} color="success" variant="contained" size="large">
            {dialogState.type === 'add' ? 'Registrar Funcionário' : 'Salvar Alterações'}
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="contained" size="large">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Ação realizada com sucesso!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default React.memo(EmployeeManagement);
