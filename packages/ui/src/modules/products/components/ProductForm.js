import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';
import { createProduct } from '../service/productService';

export const ProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    quantity: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdProduct = await createProduct(productData);
      console.log('Produto criado com sucesso:', createdProduct);
      // Redirecionar ou limpar o formulário após o sucesso
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
      setError('Erro ao criar o produto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Produto
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nome do Produto"
            name="name"
            value={productData.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Preço"
            name="price"
            value={productData.price}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantidade"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            type="number"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Cadastrar Produto
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
