'use client';
import {
  Box,
  Container,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@mui/material';

const styles = {
  Container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: '100vh',
    maxHeight: '100vh',
    height: '100vh',
    backgroundColor: '#FFFFFF',
  },
  Box: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '50%',
  },
  Paper: {
    display: 'flex',
    backgroundColor: 'yellow',
    minHeight: '95%',
    width: '95%',
    maxWidth: '95%',
    borderRadius: '1rem',
    p: 2,
    overflow: 'hidden',
  },
  TableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  Table: {
    tableLayout: 'fixed',
    width: '100%',
  },
  TableCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    padding: '8px',
  },
};

const Checkout = () => {
  return (
    <Container
      component="main"
      disableGutters={false}
      maxWidth="xl"
      sx={{ ...styles.Container }}
    >
      <Box component="aside" sx={{ ...styles.Box }}>
        <Paper
          component="section"
          elevation={24}
          square={true}
          sx={{ ...styles.Paper }}
        >
          <TableContainer component={Box} sx={{ ...styles.TableContainer }}>
            <Table padding="none" sx={{ ...styles.Table }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Código de barra
                  </TableCell>
                  <TableCell
                    align="left"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Nome do Produto
                  </TableCell>
                  <TableCell
                    align="right"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Preço
                  </TableCell>
                  <TableCell
                    align="right"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Quantidade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell datatype='text' align="left" sx={{ ...styles.TableCell }}>
                    3516546456546446664
                  </TableCell>
                  <TableCell sx={{ ...styles.TableCell }}>
                    produto
                  </TableCell>
                 <TableCell datatype='currency' align="right" sx={{ ...styles.TableCell }}>
                   10,00
                 </TableCell>
                  <TableCell datatype='number' align="right" sx={{ ...styles.TableCell }}>
                    5 
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Box component="aside" sx={{ ...styles.Box }}></Box>
    </Container>
  );
};

export default Checkout;
