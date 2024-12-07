import React, { useState, useEffect, memo } from 'react';
import {
  Box,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useDebounce, useHandleProductClick } from '../../../hooks';
import { ProductService } from '../../../service';
import { formatCurrency } from '../../../helper';

const styled = {
  Box: {
    maxHeight: '50vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  },
  TextField: {
    backgroundColor: '#FFFFFF',
    '& .MuiInputBase-root': {
      fontFamily: 'inherit',
      fontWeight: 'normal',
      fontSize: '1.25rem',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FFFFFF',
      },
      '&:hover fieldset': {
        borderColor: '#E50914',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E50914',
      },
    },
  },
  ListItemText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'inherit',
  },
};

const ProductList = memo(
  ({ products, loading, error, onProductClick, debouncedQuery }) => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          maxHeight: '40vh',
          overflowY: 'auto',
        }}
      >
        <List dense>
          {products.map((product) => (
            <ListItem
              key={product._id}
              button={true}
              onClick={() => onProductClick(product)}
              divider
            >
              <ListItemText
                primary={product.product}
                secondary={`R$ ${formatCurrency(product.price)}`}
                sx={{ ...styled.ListItemText }}
              />
            </ListItem>
          ))}
          {!products.length && debouncedQuery?.trim()?.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              Nenhum produto encontrado.
            </Typography>
          )}
        </List>
      </Box>
    );
  },
);

const SearchModal = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const { handleProductClick } = useHandleProductClick();

  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setProducts([]);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = debouncedQuery || '';
      if (!query.trim()) {
        setProducts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await ProductService.search(query);
        const filteredProducts = results
          .filter(
            (product) => product.name && typeof product.price === 'number',
          )
          .map((product) => ({
            _id: product._id,
            product: product.name,
            price: product.price,
          }));
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao buscar produtos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  const handleOpenQuantityModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setQuantityModalOpen(true);
  };

  const handleConfirmQuantity = () => {
    if (selectedProduct && quantity > 0) {
      handleProductClick(selectedProduct, quantity);
      setQuantityModalOpen(false);
      onClose();
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="search-modal-title"
        aria-describedby="search-modal-description"
      >
        <Box
          sx={{
            ...styled.Box,
            width: '100%',
            maxWidth: '45%',
          }}
        >
          <TextField
            sx={{
              ...styled.TextField,
              width: '100%',
            }}
            fullWidth
            placeholder="Digite para buscar produto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            autoComplete="off"
            margin="dense"
          />
          <ProductList
            products={products}
            loading={loading}
            error={error}
            onProductClick={handleOpenQuantityModal}
            debouncedQuery={debouncedQuery}
          />
        </Box>
      </Modal>

      <Modal
        open={quantityModalOpen}
        onClose={() => setQuantityModalOpen(false)}
        aria-labelledby="quantity-modal-title"
        aria-describedby="quantity-modal-description"
      >
        <Box
          sx={{
            ...styled.Box,
            width: '10%',
            
          }}
        >
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleConfirmQuantity();
              }
            }}
            sx={{
              ...styled.TextField,
              display: 'flex',
              justifySelf: 'center',
              width: '75%'
            }}
            autoFocus
            margin="dense"
          />
        </Box>
      </Modal>
    </>
  );
};

export default SearchModal;
