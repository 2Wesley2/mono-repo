//Client Component
"use client";

import React, { useState } from 'react';
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
import { login } from '../../../../services/fetch';

export default function SignInForm() {
  console.log(`SignInForm: Client-side render at ${new Date().toISOString()}`);

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');
      try {
        const response = await login(email, password);
        if (response) {
          router.push('/');
        }
      } catch (error) {
        console.error('Login error:', error.message);
      }
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <TextField
          error={emailError}
          helperText={emailErrorMessage}
          id="email"
          type="email"
          name="email"
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
          error={passwordError}
          helperText={passwordErrorMessage}
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
      <Button type="submit" fullWidth variant="contained">Entre</Button>
    </Box>
  );
}
