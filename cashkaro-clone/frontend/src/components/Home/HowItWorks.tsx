import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
} from '@mui/material';
import {
  PersonAdd,
  Store,
  ShoppingCart,
  AccountBalanceWallet,
} from '@mui/icons-material';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <PersonAdd />,
      title: 'Sign Up',
      description: 'Create your free account in just 30 seconds',
      color: '#4caf50',
    },
    {
      icon: <Store />,
      title: 'Shop via CashKaro',
      description: 'Visit any of our 1500+ partner stores through our website',
      color: '#2196f3',
    },
    {
      icon: <ShoppingCart />,
      title: 'Make Purchase',
      description: 'Shop normally on the retailer website',
      color: '#ff9800',
    },
    {
      icon: <AccountBalanceWallet />,
      title: 'Earn Cashback',
      description: 'Get cashback credited to your CashKaro wallet',
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        How It Works
      </Typography>
      <Grid container spacing={3}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                '&::after': index < steps.length - 1 ? {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  right: { xs: '50%', md: '-12px' },
                  bottom: { xs: '-12px', md: 'auto' },
                  transform: { xs: 'translateX(50%)', md: 'translateY(-50%)' },
                  width: { xs: '2px', md: '24px' },
                  height: { xs: '24px', md: '2px' },
                  bgcolor: 'divider',
                  display: { sm: 'none', md: 'block' },
                } : {},
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: step.color,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {step.icon}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Step {index + 1}
              </Typography>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;