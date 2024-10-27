
import React from 'react';
import SignInForm from '../../templates/mui/components/sign-in/SignInForm';
import SignInLayout from '../../templates/mui/components/sign-in/SignInLayout'

export default async function LoginPage() {
  console.log(`LoginPage: Server-side render at ${new Date().toISOString()}`);
  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  )
}