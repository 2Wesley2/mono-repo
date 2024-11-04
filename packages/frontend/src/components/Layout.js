import { Paper, Container } from '@mui/material'

const Layout = ({ children, }) => (
  <Paper
    square={false}
    sx={{
      display: 'flex',
      justifySelf: 'center',
      alignSelf: 'center',
      width: '75%',
    }}
  >
    <Container
      maxWidth='md'
      sx={{
        paddingBottom:'10%'
      }}
    >
      {children}
    </Container>
  </Paper>
);

export default Layout;
