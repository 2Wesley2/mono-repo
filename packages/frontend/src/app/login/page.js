import React from 'react';
import SignInForm from '../../templates/mui/components/sign-in/SignInForm';
import SignInLayout from '../../templates/mui/components/sign-in/SignInLayout';
import { Box, Paper } from '@mui/material';
export default function LoginPage() {
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  );
}
