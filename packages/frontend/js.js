'use client';
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
} from '@mui/material';
import { getProductsByCategories } from '../../service/product';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState(0); // Índice da aba ativa
  const [categoryProducts, setCategoryProducts] = useState({}); // Produtos por categoria
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const fetchCategoryProducts = async (category) => {
    setLoading(true);
    try {
      const response = await getProductsByCategories(category); // Busca produtos da categoria ativa
      setCategoryProducts((prevState) => ({
        ...prevState,
        [category]: response.data, // Salva os produtos no estado correspondente à categoria
      }));
    } catch (error) {
      console.error(
        `Erro ao buscar produtos para a categoria ${category}:`,
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentCategory = categories[activeTab];
    if (!categoryProducts[currentCategory]) {
      // Fetch apenas se ainda não foi carregado
      fetchCategoryProducts(currentCategory);
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Atualiza a aba ativa
  };

  return (
    <Box>
      {/* Abas de navegação */}
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>
      </AppBar>

      {/* Conteúdo da aba selecionada */}
      <Box sx={{ padding: 2 }}>
        {loading ? (
          // Indicador de carregamento
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {/* Renderiza os produtos da categoria correspondente à aba ativa */}
            {(categoryProducts[categories[activeTab]] || []).map((product) => (
              <ListItem key={product.id}>
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category} - R$ {product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}

        {/* Exibe mensagem quando não há produtos na categoria */}
        {!loading && categoryProducts[categories[activeTab]]?.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            Nenhum produto encontrado para esta categoria.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProductPage;
