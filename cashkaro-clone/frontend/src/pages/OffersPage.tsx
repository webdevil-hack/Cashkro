import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const OffersPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Offers
      </Typography>
      <Box>
        <Typography>Offers page - Coming soon</Typography>
      </Box>
    </Container>
  );
};

export default OffersPage;