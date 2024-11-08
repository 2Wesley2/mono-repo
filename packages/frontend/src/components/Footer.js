import React from 'react';
import {
  Box,
  Typography,
  Link,
  IconButton,
  Divider,
  Container,
  Button,
} from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bottom: '0',
        bgcolor: '#E50914',
        color: 'white',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="flex-start"
          gap={4}
          mb={3}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Empresa
            </Typography>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Sobre nós
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Carreiras
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Blog
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Suporte
            </Typography>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Central de Ajuda
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              FAQ
            </Link>
            <Link href="#" color="inherit" underline="hover">
              Contato
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Política de Privacidade
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              sx={{ display: 'block', mb: 1 }}
            >
              Termos de Uso
            </Link>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Inscreva-se na nossa Newsletter
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
              Receba as últimas novidades e atualizações diretamente no seu
              e-mail.
            </Typography>
            <Box
              component="form"
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <input
                type="email"
                placeholder="Seu e-mail"
                aria-label="Digite seu e-mail"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '8px',
                  flexGrow: 1,
                }}
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#F7F7F7',
                  color: '#E50914',
                }}
              >
                Inscrever-se
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'white', my: 3 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <Typography variant="body2" color="inherit" align="center">
            © {new Date().getFullYear()} Empresa. Todos os direitos reservados.
          </Typography>
          <Box display="flex" gap={1} mt={{ xs: 2, sm: 0 }}>
            <IconButton
              aria-label="Facebook"
              color="inherit"
              href="https://facebook.com"
            >
              <Facebook />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              color="inherit"
              href="https://twitter.com"
            >
              <Twitter />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              color="inherit"
              href="https://instagram.com"
            >
              <Instagram />
            </IconButton>
            <IconButton
              aria-label="LinkedIn"
              color="inherit"
              href="https://linkedin.com"
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
