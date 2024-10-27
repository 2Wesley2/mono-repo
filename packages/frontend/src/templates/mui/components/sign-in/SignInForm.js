// Client Component
"use client";

import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import ForgotPassword from './ForgotPassword';
import { useRouter } from 'next/navigation';
import { login } from '../../../../../fetch';

export default function SignInForm() {
  const [formErrors, setFormErrors] = useState({
    username: { error: false, message: '' },
    password: { error: false, message: '' },
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const validateInputs = useCallback((username, password) => {
    let valid = true;
    const newErrors = { username: { error: false, message: '' }, password: { error: false, message: '' } };

    if (!username || !/\S+@\S+\.\S+/.test(username)) {
      newErrors.username.error = true;
      newErrors.username.message = 'Por favor, insira um nome de usuário válido.';
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password.error = true;
      newErrors.password.message = 'A senha deve ter pelo menos 6 caracteres.';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    if (!validateInputs(username, password)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(username, password);
      if (response) {
        // Configurar o cookie JWT no login (depende de como o JWT é tratado no backend)
        // Certifique-se de que o login retorne e configure o token no lado do cliente
        router.push('/');  // Redireciona o usuário para a página inicial após o login bem-sucedido
      }
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        password: { error: true, message: 'Falha no login. Verifique suas credenciais.' },
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateInputs, router]);


  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="username">Nome de Usuário</FormLabel>
        <TextField
          error={formErrors.username.error}
          helperText={formErrors.username.message}
          id="username"
          type="text"
          name="username"
          placeholder="seuemail@email.com"
          required
          fullWidth
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <Link component="button" onClick={handleClickOpen} variant="body2">Esqueceu sua senha?</Link>
        </Box>
        <TextField
          error={formErrors.password.error}
          helperText={formErrors.password.message}
          name="password"
          placeholder="••••••"
          type="password"
          id="password"
          required
          fullWidth
        />
      </FormControl>
      <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Lembrar senha" />
      <ForgotPassword open={open} handleClose={handleClose} />
      <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
        {isSubmitting ? 'Carregando...' : 'Entrar'}
      </Button>
    </Box>
  );
}
