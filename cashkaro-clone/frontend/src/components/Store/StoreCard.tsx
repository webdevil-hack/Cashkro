import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  LocalOffer,
  TrendingUp,
  Verified,
  NewReleases,
} from '@mui/icons-material';
import { Store } from '../../types';

interface StoreCardProps {
  store: Store;
  viewMode: 'grid' | 'list';
}

const StoreCard: React.FC<StoreCardProps> = ({ store, viewMode }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stores/${store.slug}`);
  };

  if (viewMode === 'list') {
    return (
      <Card
        sx={{
          display: 'flex',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
        onClick={handleClick}
      >
        <CardMedia
          component="img"
          sx={{ width: 150, objectFit: 'contain', p: 2 }}
          image={store.logo || `https://via.placeholder.com/150x80?text=${store.name}`}
          alt={store.name}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <Box>
                <Typography variant="h6" component="div" gutterBottom>
                  {store.name}
                  {store.isNew && (
                    <Chip
                      icon={<NewReleases />}
                      label="New"
                      size="small"
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {store.description?.substring(0, 100)}...
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    icon={<TrendingUp />}
                    label={`Upto ${store.cashbackRate}% Cashback`}
                    color="primary"
                    size="small"
                  />
                  {store.offers && store.offers.length > 0 && (
                    <Chip
                      icon={<LocalOffer />}
                      label={`${store.offers.length} Offers`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {store.isFeatured && (
                    <Chip
                      icon={<Verified />}
                      label="Featured"
                      color="success"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                sx={{ ml: 2 }}
              >
                Shop Now
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={store.logo || `https://via.placeholder.com/300x140?text=${store.name}`}
        alt={store.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom noWrap>
          {store.name}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={`Upto ${store.cashbackRate}% Cashback`}
            color="primary"
            size="small"
            sx={{ mb: 1 }}
          />
        </Box>
        {store.offers && store.offers.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {store.offers.length} Active Offers
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
          {store.isFeatured && (
            <Chip icon={<Verified />} label="Featured" color="success" size="small" />
          )}
          {store.isNew && (
            <Chip icon={<NewReleases />} label="New" color="error" size="small" />
          )}
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Card>
  );
};

export default StoreCard;