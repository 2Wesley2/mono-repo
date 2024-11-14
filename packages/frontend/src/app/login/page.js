import React from 'react';
import SignInForm from '../../templates/mui/components/sign-in/SignInForm';
import SignInLayout from '../../templates/mui/components/sign-in/SignInLayout';

export default function LoginPage() {
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  );
}
