import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const EmployeeDialog = ({ open, onClose, onConfirm, title, initialData }) => {
  const [formData, setFormData] = useState(initialData || { name: '', number: '' });

  useEffect(() => {
    setFormData(initialData || { name: '', number: '' });
  }, [initialData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nome do Funcionário"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
        />
        <TextField
          label="ID do Funcionário"
          fullWidth
          margin="dense"
          variant="outlined"
          value={formData.number}
          onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onConfirm(formData)} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDialog;
