import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ShoppingCart,
  Check,
  ContentCopy,
  LocalOffer,
  Info,
  Timer,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import storeService from '../services/storeService';
import { useAppSelector } from '../hooks/redux';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const StoreDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [tabValue, setTabValue] = React.useState(0);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const { data: store, isLoading, error } = useQuery(
    ['store', slug],
    () => storeService.getStoreBySlug(slug!),
    {
      enabled: !!slug,
    }
  );

  const handleShopNow = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to earn cashback');
      navigate('/login', { state: { from: `/stores/${slug}` } });
      return;
    }

    if (store) {
      const { redirectUrl } = await storeService.visitStore(store.id);
      window.open(redirectUrl, '_blank');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Store not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          Home
        </Link>
        <Link color="inherit" href="/stores" onClick={(e) => { e.preventDefault(); navigate('/stores'); }}>
          Stores
        </Link>
        <Typography color="text.primary">{store.name}</Typography>
      </Breadcrumbs>

      {/* Store Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box
              component="img"
              src={store.logo || `https://via.placeholder.com/200x100?text=${store.name}`}
              alt={store.name}
              sx={{ width: '100%', maxWidth: 200, height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {store.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {store.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<TrendingUp />}
                label={`Upto ${store.cashbackRate}% Cashback`}
                color="primary"
              />
              {store.offers && store.offers.length > 0 && (
                <Chip
                  icon={<LocalOffer />}
                  label={`${store.offers.length} Active Offers`}
                  variant="outlined"
                />
              )}
              {store.categories.map((category) => (
                <Chip key={category.id} label={category.name} size="small" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleShopNow}
              sx={{ mb: 2 }}
            >
              Shop Now
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              {store.totalOrders.toLocaleString()} people shopped
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, value) => setTabValue(value)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Offers & Coupons" />
              <Tab label="How to Earn Cashback" />
              <Tab label="Terms & Conditions" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              {store.offers && store.offers.length > 0 ? (
                <List>
                  {store.offers.map((offer) => (
                    <ListItem key={offer.id} sx={{ px: 3 }}>
                      <Card sx={{ width: '100%' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" gutterBottom>
                                {offer.title}
                              </Typography>
                              {offer.description && (
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {offer.description}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                {offer.isExclusive && (
                                  <Chip label="Exclusive" color="error" size="small" />
                                )}
                                {offer.isVerified && (
                                  <Chip label="Verified" color="success" size="small" />
                                )}
                              </Box>
                            </Box>
                            {offer.code && (
                              <Button
                                variant="outlined"
                                startIcon={copiedCode === offer.code ? <Check /> : <ContentCopy />}
                                onClick={() => handleCopyCode(offer.code!)}
                                sx={{ ml: 2 }}
                              >
                                {offer.code}
                              </Button>
                            )}
                          </Box>
                          {offer.validTill && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                              <Timer fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="caption" color="text.secondary">
                                Valid till {new Date(offer.validTill).toLocaleDateString()}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" sx={{ p: 3 }}>
                  No active offers available at the moment.
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List sx={{ px: 3 }}>
                {store.howToClaim?.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Check color="success" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                )) || (
                  <>
                    <ListItem>
                      <ListItemIcon>
                        <Check color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Click on 'Shop Now' button to visit the store" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Check color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Shop normally on the retailer website" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Check color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Your cashback will be automatically tracked" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Check color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Cashback will be confirmed within 45-90 days" />
                    </ListItem>
                  </>
                )}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <List sx={{ px: 3 }}>
                {store.terms?.map((term, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Info />
                    </ListItemIcon>
                    <ListItemText primary={term} />
                  </ListItem>
                )) || (
                  <Typography variant="body1">
                    Standard terms and conditions apply. Cashback rates may vary based on product categories.
                  </Typography>
                )}
              </List>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cashback Rates
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Default Rate"
                  secondary={`${store.cashbackRate}% Cashback`}
                />
              </ListItem>
              {store.cashbackRates?.categories &&
                Object.entries(store.cashbackRates.categories).map(([category, rate]) => (
                  <ListItem key={category}>
                    <ListItemText
                      primary={category}
                      secondary={`${rate}% Cashback`}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Important Tips:
            </Typography>
            <Typography variant="body2">
              • Disable ad blockers before shopping
              <br />
              • Complete purchase in the same session
              <br />
              • Don't use other coupon sites
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StoreDetailPage;