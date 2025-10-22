import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#172337',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              CashKaro Clone
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              India's #1 Cashback & Coupons Website. Shop from 1500+ websites
              and earn extra cashback on every purchase.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                    About Us
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>
                    How It Works
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>
                    FAQs
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Contact Us
                  </Link>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>

          {/* Top Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Top Categories
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/stores?category=fashion" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Fashion
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/stores?category=electronics" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Electronics
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/stores?category=travel" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Travel
                  </Link>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <Link to="/stores?category=food" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Food & Dining
                  </Link>
                </ListItemText>
              </ListItem>
            </List>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">support@cashkaro-clone.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">+91 1234567890</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Monday - Friday: 9:00 AM - 6:00 PM
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* Bottom Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} CashKaro Clone. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link
              to="/terms"
              style={{ color: 'inherit', textDecoration: 'none', marginRight: 16 }}
            >
              Terms & Conditions
            </Link>
            <Link
              to="/privacy"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;