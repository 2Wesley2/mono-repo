import { Container, Paper } from '@mui/material';


export const metadata = {
  title: ' Gerenciamento de clientes',
  description: 'Página gerenciar clientes',
};

const CustomerManagementLayout = ({ children }) => (
  <div className='layout'>
    <Paper sx={{ minHeight: '80vh' }}>
      <Container>
        {children}
      </Container>
    </Paper>
  </div>
);

export default CustomerManagementLayout;
