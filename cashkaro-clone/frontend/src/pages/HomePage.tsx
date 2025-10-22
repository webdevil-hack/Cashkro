import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Chip,
  Skeleton,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useQuery } from '@tanstack/react-query';
import storeService from '../services/storeService';
import HowItWorks from '../components/Home/HowItWorks';
import CategoryGrid from '../components/Home/CategoryGrid';
import { TrendingUp, LocalOffer, Star } from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { data: featuredStores, isLoading: loadingFeatured } = useQuery(
    ['featuredStores'],
    () => storeService.getFeaturedStores()
  );

  const { data: popularStores, isLoading: loadingPopular } = useQuery(
    ['popularStores'],
    () => storeService.getPopularStores()
  );

  const { data: topCashbackStores, isLoading: loadingTopCashback } = useQuery(
    ['topCashbackStores'],
    () => storeService.getTopCashbackStores()
  );

  const banners = [
    {
      id: 1,
      title: 'Earn Extra Cashback on Every Purchase',
      subtitle: 'Shop from 1500+ stores and save more',
      image: 'https://via.placeholder.com/1200x400/2874f0/ffffff?text=Cashback+Banner',
      cta: 'Start Shopping',
    },
    {
      id: 2,
      title: 'Refer Friends & Earn ₹100',
      subtitle: 'Get ₹100 bonus for every friend who joins',
      image: 'https://via.placeholder.com/1200x400/ff6161/ffffff?text=Refer+Banner',
      cta: 'Refer Now',
    },
  ];

  const stats = [
    { label: 'Happy Users', value: '10M+', icon: <Star /> },
    { label: 'Partner Stores', value: '1500+', icon: <LocalOffer /> },
    { label: 'Cashback Paid', value: '₹100Cr+', icon: <TrendingUp /> },
  ];

  const handleStoreClick = (slug: string) => {
    navigate(`/stores/${slug}`);
  };

  const renderStoreCard = (store: any) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={() => handleStoreClick(store.slug)}
    >
      <CardMedia
        component="img"
        height="120"
        image={store.logo || 'https://via.placeholder.com/300x120?text=' + store.name}
        alt={store.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {store.name}
        </Typography>
        <Chip
          label={`Upto ${store.cashbackRate}% Cashback`}
          color="primary"
          size="small"
          sx={{ mb: 1 }}
        />
        {store.offers && store.offers.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {store.offers.length} Offers Available
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Hero Banner Carousel */}
      <Box sx={{ mb: 4 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          style={{ height: '400px' }}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Box
                sx={{
                  height: '400px',
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Container>
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h3" gutterBottom>
                      {banner.title}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      {banner.subtitle}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={() => navigate('/stores')}
                    >
                      {banner.cta}
                    </Button>
                  </Box>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                }}
              >
                <Box sx={{ mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h4" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body1">{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* How It Works */}
        <HowItWorks />

        {/* Featured Stores */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Featured Stores
          </Typography>
          <Grid container spacing={3}>
            {loadingFeatured
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))
              : featuredStores?.slice(0, 8).map((store) => (
                  <Grid item xs={12} sm={6} md={3} key={store.id}>
                    {renderStoreCard(store)}
                  </Grid>
                ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/stores?featured=true')}
            >
              View All Featured Stores
            </Button>
          </Box>
        </Box>

        {/* Categories */}
        <CategoryGrid />

        {/* Popular Stores */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Popular Stores
          </Typography>
          <Grid container spacing={3}>
            {loadingPopular
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))
              : popularStores?.slice(0, 8).map((store) => (
                  <Grid item xs={12} sm={6} md={3} key={store.id}>
                    {renderStoreCard(store)}
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* Top Cashback Stores */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Top Cashback Stores
          </Typography>
          <Grid container spacing={3}>
            {loadingTopCashback
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))
              : topCashbackStores?.slice(0, 8).map((store) => (
                  <Grid item xs={12} sm={6} md={3} key={store.id}>
                    {renderStoreCard(store)}
                  </Grid>
                ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Paper
          sx={{
            p: 4,
            mb: 6,
            textAlign: 'center',
            bgcolor: 'secondary.main',
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Start Earning Cashback Today!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Join millions of users who save money on every purchase
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'secondary.main' }}
            onClick={() => navigate('/register')}
          >
            Sign Up For Free
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;