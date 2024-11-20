'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getProductsByCategories } from '../../service/product';
import OrderService from '@/service/order';

const categories = ['Refeições', 'Geral', 'Bebidas', 'Salgados', 'Lanches'];

const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [commandNumber, setCommandNumber] = useState('');
  const [currentOrder, setCurrentOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCategoryProducts = useCallback(
    async (category) => {
      if (categoryProducts[category]) return;
      setLoading(true);
      try {
        const response = await getProductsByCategories(category);
        setCategoryProducts((prevState) => ({
          ...prevState,
          [category]: response.data,
        }));
      } catch (error) {
        console.error(
          `Erro ao buscar produtos para a categoria ${category}:`,
          error,
        );
        setErrorMessage('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    },
    [categoryProducts],
  );

  useEffect(() => {
    const currentCategory = categories[activeTab];
    fetchCategoryProducts(currentCategory);
  }, [activeTab, fetchCategoryProducts]);

  const validateCommandInput = (input) => {
    if (input.trim().toUpperCase() === 'X') return 'FINALIZE';
    if (/^\d+$/.test(input.trim())) return 'VALID';
    return 'INVALID';
  };

  const handleCommandNumberEnter = (event) => {
    if (event.key !== 'Enter') return;

    const validation = validateCommandInput(commandNumber);

    if (validation === 'FINALIZE') {
      if (currentOrder.length > 0) {
        OrderService.bulkCreate({
          commandNumber,
          items: currentOrder.map(({ product, quantity }) => ({
            productId: product._id,
            quantity,
          })),
        })
          .then(() => {
            setCommandNumber('');
            setCurrentOrder([]);
            setErrorMessage('');
            console.log('Comanda finalizada com sucesso!');
          })
          .catch((error) => {
            console.error('Erro ao finalizar comanda:', error);
            setErrorMessage('Erro ao finalizar a comanda. Tente novamente.');
          });
      } else {
        setCommandNumber('');
        setErrorMessage('');
      }
    } else if (validation === 'VALID') {
      setErrorMessage('');
    } else {
      setErrorMessage(
        'Insira um número de comanda válido ou "X" para finalizar.',
      );
    }
  };

  const handleAddProduct = (product) => {
    if (!commandNumber || validateCommandInput(commandNumber) === 'FINALIZE') {
      setErrorMessage(
        'Defina um número de comanda antes de adicionar produtos.',
      );
      return;
    }

    setCurrentOrder((prevOrder) => {
      const existingProduct = prevOrder.find(
        (item) => item.product._id === product._id,
      );
      if (existingProduct) {
        return prevOrder.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevOrder, { product, quantity: 1 }];
      }
    });
    setErrorMessage('');
  };

  const currentCategory = categories[activeTab];
  const products = useMemo(
    () => categoryProducts[currentCategory] || [],
    [currentCategory, categoryProducts],
  );

  return (
    <Container
      disableGutters
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#D2B48C',
      }}
    >
      <Box
        sx={{
          height: '60vh',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 1,
        }}
      >
        <TextField
          autoFocus
          value={commandNumber}
          onChange={(e) => setCommandNumber(e.target.value)}
          onKeyDown={handleCommandNumberEnter}
          placeholder="Número da comanda ou 'X'"
          aria-label="Campo para inserir o número da comanda ou finalizar com X"
          sx={{
            color: '#FF0000',
            display: 'flex',
            alignSelf: 'flex-start',
            width: '50%',
            backgroundColor: '#FFFFFF',
            '& .css-quhxjy-MuiInputBase-root-MuiOutlinedInput-root': {
              fontFamily: 'Roboto, Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            },
          }}
          margin="dense"
        />

        <Box
          sx={{
            overflowY: 'auto',
            height: '100%',
            display: 'flex',
            alignSelf: 'flex-start',
            width: '50%',
          }}
        >
          <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome do Produto</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrder.map(({ product, quantity }) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toFixed(2)}</TableCell>
                    <TableCell>{quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <Box
        sx={{
          height: '40vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            backgroundColor: '#FFFFFF',
            '& .MuiTab-root': {
              width: `${100 / categories.length}%`,
              textAlign: 'center',
              fontSize: '1.5rem',
              color: '#000000',
              fontFamily: 'Roboto, Arial, sans-serif !important',
              fontWeight: 'normal',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#E50914',
              fontWeight: 'normal',
            },
            '& .css-hmk518-MuiButtonBase-root-MuiTab-root.Mui-selected': {
              color: '#E50914',
              fontWeight: 'bold',
            },
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category} />
          ))}
        </Tabs>

        <Box
          sx={{
            flex: '1 1 auto',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 2,
            padding: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : products.length > 0 ? (
            products.map((product) => (
              <Paper
                key={product.barcode}
                sx={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => handleAddProduct(product)}
                aria-label={`Adicionar produto ${product.name}`}
              >
                <Typography
                  align="center"
                  gutterBottom
                  variant="body1"
                  sx={{
                    overflow: 'hidden',
                    fontFamily: 'Roboto, Arial, sans-serif !important',
                    fontWeight: 'normal',
                  }}
                >
                  {product.name}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body1">
              Nenhum produto encontrado para a categoria "{currentCategory}".
            </Typography>
          )}
        </Box>
        {errorMessage && (
          <Box
            sx={{
              padding: 2,
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
            }}
            role="alert"
          >
            {errorMessage}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OrderScreen;
