import { Container, Paper } from '@mui/material';

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
