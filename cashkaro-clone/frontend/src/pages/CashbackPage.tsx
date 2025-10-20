import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const CashbackPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Cashback
      </Typography>
      <Box>
        <Typography>Cashback page - Coming soon</Typography>
      </Box>
    </Container>
  );
};

export default CashbackPage;