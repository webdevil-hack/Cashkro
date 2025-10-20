import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  Checkroom,
  Devices,
  Flight,
  Restaurant,
  LocalGroceryStore,
  HealthAndSafety,
  Book,
  SportsEsports,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import storeService from '../../services/storeService';

const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery(
    ['categories'],
    () => storeService.getCategories()
  );

  const categoryIcons: { [key: string]: React.ReactElement } = {
    fashion: <Checkroom />,
    electronics: <Devices />,
    travel: <Flight />,
    food: <Restaurant />,
    grocery: <LocalGroceryStore />,
    health: <HealthAndSafety />,
    education: <Book />,
    gaming: <SportsEsports />,
  };

  const categoryColors: { [key: string]: string } = {
    fashion: '#e91e63',
    electronics: '#2196f3',
    travel: '#00bcd4',
    food: '#ff5722',
    grocery: '#4caf50',
    health: '#9c27b0',
    education: '#3f51b5',
    gaming: '#ff9800',
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/stores?category=${slug}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Shop by Category
      </Typography>
      <Grid container spacing={3}>
        {categories?.slice(0, 8).map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 2,
                },
              }}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: categoryColors[category.slug] || '#757575',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {categoryIcons[category.slug] || <LocalGroceryStore />}
                </Avatar>
                <Typography variant="subtitle1" noWrap>
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoryGrid;