import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Logo from '@/components/global/Logo';

export default function SignInLayout({ children }) {
  console.log(
    `SignInLayout: Server-side render at ${new Date().toISOString()}`,
  );
  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignContent="center"
        sx={{
          padding: { xs: 2, sm: 4 },
          gap: '27.5% ',
          height: '100vh',
        }}
      >
        <Logo width={400} height={150} />

        <Card
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            width: '100%',
            padding: 4,
            gap: 3,
            margin: 0,
            maxWidth: { sm: '450px' },
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ fontSize: '2.15rem', color: '#d32f2f' }}
          >
            Entre
          </Typography>
          {children}
        </Card>
      </Stack>
    </>
  );
}
