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
  console.log('Renderizando OrderScreen...');
  const [activeTab, setActiveTab] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [commandNumber, setCommandNumber] = useState('');
  const [activeCommandNumber, setActiveCommandNumber] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isWaitingForProduct, setIsWaitingForProduct] = useState(false);

  // Carrega dados do localStorage apenas na montagem
  useEffect(() => {
    const savedCommandNumber = localStorage.getItem('commandNumber');
    const savedIsWaitingForProduct =
      localStorage.getItem('isWaitingForProduct') === 'true';

    if (savedCommandNumber) {
      console.log(`Recuperando número da comanda salvo: ${savedCommandNumber}`);
      setActiveCommandNumber(savedCommandNumber);
      setIsWaitingForProduct(savedIsWaitingForProduct);
      console.log(
        `Estado restaurado: aguardando produtos = ${savedIsWaitingForProduct}`,
      );
    } else {
      console.log('Nenhum número de comanda salvo encontrado no localStorage.');
    }
  }, []);

  // Salva no localStorage quando necessário
  useEffect(() => {
    if (activeCommandNumber !== null) {
      localStorage.setItem('commandNumber', activeCommandNumber);
      localStorage.setItem('isWaitingForProduct', isWaitingForProduct);
      console.log(
        `Estado salvo no localStorage: comanda = ${activeCommandNumber}, aguardando produtos = ${isWaitingForProduct}`,
      );
    }
  }, [activeCommandNumber, isWaitingForProduct]);

  // Função para buscar produtos
  const fetchCategoryProducts = useCallback(
    async (category) => {
      if (categoryProducts[category]) {
        console.log(`Produtos já carregados para a categoria: ${category}`);
        return;
      }

      console.log(`Iniciando busca de produtos para a categoria: ${category}`);
      setLoading(true);

      try {
        const response = await getProductsByCategories(category);
        console.log(
          `Produtos carregados com sucesso para a categoria: ${category}`,
        );
        setCategoryProducts((prevState) => ({
          ...prevState,
          [category]: response.data,
        }));
      } catch (error) {
        console.error(
          `Erro ao buscar produtos para a categoria "${category}":`,
          error,
        );
        setErrorMessage(
          `Erro ao carregar produtos para a categoria "${category}".`,
        );
      } finally {
        setLoading(false);
      }
    },
    [categoryProducts],
  );

  useEffect(() => {
    const currentCategory = categories[activeTab];
    console.log(`Categoria ativa selecionada: ${currentCategory}`);
    fetchCategoryProducts(currentCategory);
  }, [activeTab, fetchCategoryProducts]);

  const validateCommandInput = (input) => {
    const trimmedInput = input.trim().toUpperCase();

    if (trimmedInput === 'X') {
      console.log('Entrada "X" detectada: comando para finalizar.');
      return 'FINALIZE';
    }
    if (/^\d+$/.test(trimmedInput)) {
      console.log(`Entrada válida detectada: ${input}`);
      return 'VALID';
    }

    console.warn(`Entrada inválida detectada: "${input}"`);
    return 'INVALID';
  };

  const handleCommandNumberEnter = async (event) => {
    if (event.key !== 'Enter') return;

    const validation = validateCommandInput(commandNumber);

    if (validation === 'FINALIZE') {
      console.log('Finalizando comanda...');
      if (currentOrder.length > 0) {
        try {
          console.log(
            `Finalizando comanda ${activeCommandNumber} com ${currentOrder.length} produtos.`,
          );
          await OrderService.bulkCreate({
            commandNumber: activeCommandNumber,
            items: currentOrder.map(({ product, quantity }) => ({
              productId: product._id,
              quantity,
            })),
          });
          resetCommandState();
          console.log('Comanda finalizada com sucesso!');
        } catch (error) {
          console.error('Erro ao finalizar comanda:', error);
          setErrorMessage('Erro ao finalizar a comanda. Tente novamente.');
        }
      } else {
        console.log(`Finalizando comanda ${activeCommandNumber} sem produtos.`);
        resetCommandState();
      }
    } else if (validation === 'VALID') {
      if (isWaitingForProduct && currentOrder.length > 0) {
        try {
          const orderData = {
            orderNumber: activeCommandNumber,
            status: 'In Progress',
            products: currentOrder.map(({ product, quantity }) => ({
              product: product._id,
              quantity,
            })),
          };
          await OrderService.create(orderData);
          console.log('Pedido criado com sucesso!');
          setErrorMessage('');
          setCurrentOrder([]);
        } catch (error) {
          console.error('Erro ao criar o pedido:', error);
          setErrorMessage('Erro ao criar o pedido. Tente novamente.');
        }
      } else if (!isWaitingForProduct) {
        setIsWaitingForProduct(true);
        setActiveCommandNumber(commandNumber);
        console.log(`Ativando comanda ${commandNumber}`);
      } else {
        console.warn('Tentativa de criar pedido sem produtos.');
        setErrorMessage('Adicione produtos antes de continuar.');
      }
    } else {
      console.warn('Entrada inválida recebida.');
      setErrorMessage(
        'Insira um número de comanda válido ou "X" para finalizar.',
      );
    }

    setCommandNumber('');
  };

  const resetCommandState = () => {
    console.log('Resetando estado da comanda...');
    setCommandNumber('');
    setActiveCommandNumber(null);
    setCurrentOrder([]);
    setErrorMessage('');
    setIsWaitingForProduct(false);
    localStorage.removeItem('commandNumber');
    localStorage.removeItem('isWaitingForProduct');
    console.log('Estado resetado com sucesso.');
  };

  // Adicionar produto
  const handleAddProduct = useCallback(
    (product) => {
      if (!activeCommandNumber) {
        setErrorMessage(
          'Defina um número de comanda antes de adicionar produtos.',
        );
        console.warn('Tentativa de adicionar produto sem comanda ativa.');
        return;
      }

      setCurrentOrder((prevOrder) => {
        const existingProduct = prevOrder.find(
          (item) => item.product._id === product._id,
        );

        if (existingProduct) {
          console.log(
            `Atualizando quantidade para o produto: ${product.name} (+1).`,
          );
          return prevOrder.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          console.log(`Adicionando novo produto: ${product.name}`);
          return [...prevOrder, { product, quantity: 1 }];
        }
      });

      setErrorMessage('');
    },
    [activeCommandNumber],
  );

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
          padding: '1%',
        }}
      >
        <Typography
          gutterBottom
          sx={{
            fontFamily: 'Roboto, Arial, sans-serif',
            display: 'flex',
            alignSelf: 'flex-start',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: activeCommandNumber ? '#E50914' : '#006400',
          }}
        >
          {activeCommandNumber ? (
            <>
              Comanda&nbsp;
              <Typography
                component="span"
                sx={{
                  fontSize: 'inherit',
                  fontWeight: 'bold',
                  color: '#000000',
                }}
              >
                {activeCommandNumber}
              </Typography>
              &nbsp;aguardando produto{' '}
            </>
          ) : (
            'Aguardando Comanda'
          )}
        </Typography>

        <TextField
          autoFocus
          value={commandNumber}
          onChange={(e) => setCommandNumber(e.target.value)}
          onKeyDown={handleCommandNumberEnter}
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
          <TableContainer
            component={Paper}
            sx={{
              padding: '0.7%',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              '& .MuiTableHead-root': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                fontFamily: 'Roboto, Arial, sans-serif',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                color: '#333',
              },
              '& .MuiTableBody-root .MuiTableCell-root': {
                fontFamily: 'Roboto, Arial, sans-serif',
                fontSize: '0.875rem',
                color: '#555',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: '#f9f9f9',
                transition: 'background-color 0.3s ease',
              },
            }}
          >
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Nome do Produto</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentOrder.map(({ product, quantity }) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">
                      {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{quantity}</TableCell>
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
            marginInline: '1% 1%',
            backgroundColor: '#F7F7F7',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            '& .MuiTab-root': {
              width: `${100 / categories.length}%`,
              textAlign: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              color: '#000000',
              fontFamily: 'Roboto, Arial, sans-serif !important',
              fontWeight: 'normal',
              textTransform: 'none',
              transition: 'color 0.3s ease, background-color 0.3s ease',
              borderBottom: '2px solid transparent',
              '&:hover': {
                backgroundColor: '#EFEFEF', // Cor de fundo ao passar o mouse
                color: '#E50914', // Destaque de cor ao passar o mouse
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#E50914',
              height: '4px',
              borderRadius: '4px 4px 0 0',
            },
            '& .css-hmk518-MuiButtonBase-root-MuiTab-root.Mui-selected': {
              color: '#E50914', // Cor ao ser selecionado
              fontWeight: 'bold',
              borderBottom: '2px solid #E50914',
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
            padding: '1%',
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
