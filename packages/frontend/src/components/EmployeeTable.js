import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EmployeeTable = React.memo(({ employees, onEdit, onDelete }) => (
  <TableContainer component={Paper} style={{ marginTop: '20px' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Nome do Funcionário</TableCell>
          <TableCell>ID</TableCell>
          <TableCell>Data de Cadastro</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {employees.map(({ _id, name, number, createdAt }) => (
          <TableRow key={_id}>
            <TableCell>{name}</TableCell>
            <TableCell>{number}</TableCell>
            <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => onEdit({ _id, name, number })}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => onDelete({ _id, name })}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
));

export default EmployeeTable;
