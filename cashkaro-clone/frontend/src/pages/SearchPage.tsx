import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const SearchPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      <Box>
        <Typography>Search page - Coming soon</Typography>
      </Box>
    </Container>
  );
};

export default SearchPage;