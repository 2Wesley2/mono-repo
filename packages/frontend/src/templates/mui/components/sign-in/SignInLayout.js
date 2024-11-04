import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

export default function SignInLayout({ children }) {
  console.log(`SignInLayout: Server-side render at ${new Date().toISOString()}`);
  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          minHeight: '100%',
          padding: { xs: 2, sm: 4 },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: 4,
            gap: 2,
            margin: 'auto',
            maxWidth: { sm: '450px' },
          }}>
          <Typography component="h1" variant="h4" sx={{ fontSize: '2.15rem' }}>
            Entre
          </Typography>
          {children}
        </Card>
      </Stack>
    </>
  );
}