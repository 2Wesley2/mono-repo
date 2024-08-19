import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { getAllProducts } from '../service/productService';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect is called");
    const fetchProducts = async () => {
      console.log("Fetching products");
      try {
        const products = await getAllProducts();
        console.log("Products fetched: ", products);
        setProducts(products);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching products: ", error);
        setError('Erro ao carregar os produtos');
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
    
    if (isLoading) {
      return <Typography>Loading...</Typography>;
    }
    
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Lista de Produtos
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={4}>
          {products.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  
}
