import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { ProductForm, ProductList } from '../components';
import { getAllProducts } from '../service/productService';
import { handleEditProduct } from '../utils/handleEditProduct';

export const ProductsManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setProducts(products);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSaveProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleLocalEditProduct = async (product, onEdit) => {
    try {
      await handleEditProduct(product, (updated) => {
        setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      });
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Sistema de Gerenciamento de Produtos
        </Typography>
      </Grid>

      {/* Menu */}
      <Grid item xs={2}>
        <Typography variant="h6">Menu</Typography>
        <Typography variant="body1">Página Inicial</Typography>
        <Typography variant="body1">Cadastrar Prod.</Typography>
        <Typography variant="body1">Listar Prod.</Typography>
        <Typography variant="body1">Configurações</Typography>
        <Typography variant="body1">Sair</Typography>
      </Grid>

      {/* Cadastro de Produto */}
      <Grid item xs={5}>
        <Typography variant="h6">Cadastro de Produto</Typography>
        <ProductForm onSave={handleSaveProduct} />
      </Grid>

      {/* Lista de Produtos */}
      <Grid item xs={5}>
        <Typography variant="h6">Lista de Produtos</Typography>
        {loading ? (
          <Typography>Carregando produtos...</Typography>
        ) : (
          <ProductList products={products} onEdit={handleLocalEditProduct} onDelete={handleDeleteProduct} />
        )}
      </Grid>
    </Grid>
  );
};
