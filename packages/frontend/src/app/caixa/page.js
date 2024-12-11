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
    borderRadius: '1rem',
    p: 2,
  },
  TableCell: {
    fontSize: 'clamp(0.75rem, 1vw, 1rem)', // Ajusta a fonte dinamicamente
    whiteSpace: 'normal', // Permite que o texto quebre em várias linhas
    wordWrap: 'break-word', // Quebra palavras longas
    overflowWrap: 'break-word', // Ajuda a quebrar palavras longas
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
          <TableContainer component={Paper}>
            <Table padding="none">
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
                    align="left"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Preço
                  </TableCell>
                  <TableCell
                    align="left"
                    variant="head"
                    sx={{ ...styles.TableCell }}
                  >
                    Quantidade
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="left" sx={{ ...styles.TableCell }}>
                    Código de barraaaaaaaaaaaaaaaaaaaaaaa
                  </TableCell>
                  <TableCell sx={{ ...styles.TableCell }}>
                    produtoaaaaaaaaaaaaaaaaaaaaa
                  </TableCell>
                  <TableCell align="right" sx={{ ...styles.TableCell }}>
                    quantidadaaaaaaaaaaaaaa
                  </TableCell>
                  <TableCell align="right" sx={{ ...styles.TableCell }}>
                    valor unitáraaaaaaaaaaaaaaaaaioaa
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
