import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const EmailVerificationPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Email Verification
      </Typography>
      <Box>
        <Typography>Email verification page - Coming soon</Typography>
      </Box>
    </Container>
  );
};

export default EmailVerificationPage;