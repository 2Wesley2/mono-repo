import { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useDebounce, useHandleProductClick } from '../../../hooks';
import { ProductService } from '../../../service';
import { formatCurrency } from '../../../helper';

const SearchModal = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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
      if (!debouncedQuery) {
        setProducts([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const results = await ProductService.search(debouncedQuery);
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

  const handleAddProduct = (product) => {
    handleProductClick(product);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="search-modal-title"
      aria-describedby="search-modal-description"
    >
      <Box
        sx={{
          maxHeight: '50vh',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '45%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <TextField
          sx={{
            width: '100%',
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
          }}
          fullWidth
          placeholder="Digite para buscar produto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          slotProps={{
            input: {
              onInput: (e) => {
                e.target.value = e.target.value.toUpperCase();
              },
            },
            autoComplete: 'new-password',
          }}
          autoComplete="off"
          margin="dense"
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              p: 1,
              maxHeight: '40vh',
              overflowY: 'auto',
            }}
          >
            <List dense>
              {products.map((product, index) => (
                <ListItem
                  key={product._id}
                  button
                  onClick={() => handleAddProduct(product)}
                  divider
                >
                  <ListItemText
                    primary={product.product}
                    secondary={`R$ ${formatCurrency(product.price)}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      fontFamily: 'inherit',
                    }}
                  />
                </ListItem>
              ))}
              {!products.length && debouncedQuery && (
                <Typography variant="body2" color="textSecondary">
                  Nenhum produto encontrado.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default SearchModal;
