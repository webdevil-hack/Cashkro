import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  Paper,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  Search,
  GridView,
  ViewList,
  FilterList,
  Close,
  LocalOffer,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import storeService from '../services/storeService';
import { StoreFilters } from '../types';
import StoreCard from '../components/Store/StoreCard';

const StoresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<StoreFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    featured: searchParams.get('featured') === 'true',
    sort: (searchParams.get('sort') as any) || 'priority',
    page: parseInt(searchParams.get('page') || '1'),
    limit: 20,
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { data: storesData, isLoading } = useQuery(
    ['stores', { ...filters, search: debouncedSearch }],
    () => storeService.getStores({ ...filters, search: debouncedSearch }),
    {
      keepPreviousData: true,
    }
  );

  const { data: categories } = useQuery(
    ['categories'],
    () => storeService.getCategories()
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.featured) params.set('featured', 'true');
    if (filters.sort && filters.sort !== 'priority') params.set('sort', filters.sort);
    if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: keyof StoreFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page on filter change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      featured: false,
      sort: 'priority',
      page: 1,
      limit: 20,
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.featured,
    filters.sort !== 'priority',
  ].filter(Boolean).length;

  const FilterSidebar = () => (
    <Box sx={{ p: 3, width: { xs: 250, sm: 300 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)} sx={{ display: { md: 'none' } }}>
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Categories
      </Typography>
      <List sx={{ mb: 3 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={!filters.category}
            onClick={() => handleFilterChange('category', '')}
          >
            <ListItemText primary="All Categories" />
          </ListItemButton>
        </ListItem>
        {categories?.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={filters.category === category.slug}
              onClick={() => handleFilterChange('category', category.slug)}
            >
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mb: 3 }} />

      {/* Featured Only */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={filters.featured}
          exclusive
          onChange={(_, value) => handleFilterChange('featured', value)}
          fullWidth
        >
          <ToggleButton value={false}>All Stores</ToggleButton>
          <ToggleButton value={true}>Featured Only</ToggleButton>
        </ToggleButtonGroup>
      </FormControl>

      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        disabled={activeFiltersCount === 0}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          All Stores
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Shop from {storesData?.pagination.total || 0} stores and earn cashback
        </Typography>
      </Box>

      {/* Filters Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search stores..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sort}
                label="Sort By"
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <MenuItem value="priority">Recommended</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="cashback">Highest Cashback</MenuItem>
                <MenuItem value="popular">Most Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_, value) => value && setViewMode(value)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridView />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawerOpen(true)}
                sx={{ display: { md: 'none' } }}
              >
                Filters
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
              />
            )}
            {filters.category && (
              <Chip
                label={`Category: ${categories?.find(c => c.slug === filters.category)?.name}`}
                onDelete={() => handleFilterChange('category', '')}
                size="small"
              />
            )}
            {filters.featured && (
              <Chip
                label="Featured Only"
                onDelete={() => handleFilterChange('featured', false)}
                size="small"
              />
            )}
            {filters.sort !== 'priority' && (
              <Chip
                label={`Sort: ${filters.sort}`}
                onDelete={() => handleFilterChange('sort', 'priority')}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Desktop Filters Sidebar */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper sx={{ position: 'sticky', top: 80 }}>
            <FilterSidebar />
          </Paper>
        </Grid>

        {/* Stores Grid/List */}
        <Grid item xs={12} md={9}>
          {isLoading ? (
            <Grid container spacing={3}>
              {Array.from(new Array(12)).map((_, index) => (
                <Grid item xs={12} sm={6} lg={viewMode === 'grid' ? 4 : 12} key={index}>
                  <Skeleton variant="rectangular" height={viewMode === 'grid' ? 250 : 120} />
                </Grid>
              ))}
            </Grid>
          ) : storesData?.data.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No stores found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {storesData?.data.map((store) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={viewMode === 'grid' ? 4 : 12}
                    key={store.id}
                  >
                    <StoreCard store={store} viewMode={viewMode} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {storesData && storesData.pagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={storesData.pagination.pages}
                    page={storesData.pagination.page}
                    onChange={(_, page) => handleFilterChange('page', page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <FilterSidebar />
      </Drawer>
    </Container>
  );
};

export default StoresPage;