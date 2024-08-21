import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export const ProductList = ({ products, onEdit, onDelete }) => {
  const handleEditClick = (product) => {
    onEdit(product);
  };

  const handleDeleteClick = (productId) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      onDelete(productId);
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel>Nome</TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel>Preço</TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel>Qtde</TableSortLabel>
            </TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} hover>
              <TableCell>{product.name}</TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </TableCell>
              <TableCell align="right">{product.quantity}</TableCell>
              <TableCell align="right">
                <Tooltip title="Editar">
                  <IconButton onClick={() => handleEditClick(product)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Deletar">
                  <IconButton onClick={() => handleDeleteClick(product._id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
