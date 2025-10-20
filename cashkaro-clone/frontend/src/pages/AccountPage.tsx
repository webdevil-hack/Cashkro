import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AccountPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Account
      </Typography>
      <Box>
        <Typography>Account page - Coming soon</Typography>
      </Box>
    </Container>
  );
};

export default AccountPage;