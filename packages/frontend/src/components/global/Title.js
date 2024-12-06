import React from 'react';
import Typography from '@mui/material/Typography';

const Title = ({ children, ...props }) => (
  <Typography
    variant="h4"
    component="h1"
    gutterBottom
    fontWeight="bold"
    sx={{
      textAlign: 'center',
      mb: 3,
      fontWeight: 'bold',
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Typography>
);

export default Title;
