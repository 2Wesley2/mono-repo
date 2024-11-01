import { Container, Paper } from '@mui/material';

const EmployeesManagementLayout = ({ children }) => (
  <div className='layout'>
    <Paper sx={{ minHeight: '80vh' }}>
      <Container>
        {children}
      </Container>
    </Paper>
  </div>
);

export default EmployeesManagementLayout;
