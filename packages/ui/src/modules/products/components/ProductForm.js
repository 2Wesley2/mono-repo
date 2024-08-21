import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { createProduct } from '../service/productService';

export const ProductForm = ({ onSave }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [error, setError] = useState(null);

  const handleSaveProduct = async () => {
    try {
      const newProduct = await createProduct({
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(productQuantity),
      });
      onSave(newProduct);
      setProductName('');
      setProductPrice('');
      setProductQuantity('');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Nome do Produto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Preço"
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        style={{ marginTop: '16px' }}
      />
      <TextField
        fullWidth
        label="Quantidade"
        type="number"
        value={productQuantity}
        onChange={(e) => setProductQuantity(e.target.value)}
        style={{ marginTop: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={handleSaveProduct} style={{ marginTop: '16px' }}>
        Salvar Produto
      </Button>
    </div>
  );
};
