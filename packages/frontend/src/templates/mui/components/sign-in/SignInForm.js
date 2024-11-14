'use client';

import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import ForgotPassword from './ForgotPassword';
import { useRouter } from 'next/navigation';
import { login } from '../../../../service/fetch';

export default function SignInForm() {
  const [formErrors, setFormErrors] = useState({
    username: { error: false, message: '' },
    password: { error: false, message: '' },
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleClose = useCallback(() => setOpen(false), []);

  const validateInputs = useCallback((username, password) => {
    let valid = true;
    const newErrors = {
      username: { error: false, message: '' },
      password: { error: false, message: '' },
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !emailRegex.test(username)) {
      newErrors.username.error = true;
      newErrors.username.message =
        'Por favor, insira um nome de usuário válido.';
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

  const handleSubmit = useCallback(
    async (event) => {
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
          router.push('/');
        }
      } catch (error) {
        setFormErrors((prev) => ({
          ...prev,
          password: {
            error: true,
            message: 'Falha no login. Verifique suas credenciais.',
          },
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateInputs, router],
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <Backdrop
        open={isSubmitting}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <FormControl>
        <TextField
          error={formErrors.username.error}
          helperText={formErrors.username.message}
          id="username"
          name="username"
          type="text"
          placeholder="Email"
          required
          fullWidth
          aria-describedby={
            formErrors.username.error ? 'username-error' : undefined
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#d32f2f',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#d32f2f',
              },
            },
          }}
        />
      </FormControl>
      <FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        </Box>
        <TextField
          error={formErrors.password.error}
          helperText={formErrors.password.message}
          name="password"
          placeholder="Senha"
          type="password"
          id="password"
          required
          fullWidth
          aria-describedby={
            formErrors.password.error ? 'password-error' : undefined
          }
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#d32f2f',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#d32f2f',
              },
            },
          }}
        />
      </FormControl>
      <ForgotPassword open={open} handleClose={handleClose} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        color="error"
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Carregando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </Box>
  );
}
