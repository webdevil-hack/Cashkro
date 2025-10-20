import api from './api';
import { 
  Store, 
  Category, 
  ApiResponse, 
  PaginatedResponse,
  StoreFilters,
  Offer
} from '../types';

class StoreService {
  async getStores(filters: StoreFilters = {}): Promise<PaginatedResponse<Store>> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<ApiResponse<{
      stores: Store[];
      pagination: any;
    }>>(`/stores?${params.toString()}`);
    
    return {
      data: response.data.data!.stores,
      pagination: response.data.data!.pagination,
    };
  }

  async getStoreBySlug(slug: string): Promise<Store> {
    const response = await api.get<ApiResponse<{ store: Store }>>(`/stores/${slug}`);
    return response.data.data!.store;
  }

  async getFeaturedStores(): Promise<Store[]> {
    const response = await api.get<ApiResponse<{ stores: Store[] }>>('/stores/featured');
    return response.data.data!.stores;
  }

  async getPopularStores(): Promise<Store[]> {
    const response = await api.get<ApiResponse<{ stores: Store[] }>>('/stores/popular');
    return response.data.data!.stores;
  }

  async getTopCashbackStores(): Promise<Store[]> {
    const response = await api.get<ApiResponse<{ stores: Store[] }>>('/stores/top-cashback');
    return response.data.data!.stores;
  }

  async searchStores(query: string): Promise<Store[]> {
    const response = await api.get<ApiResponse<{ stores: Store[] }>>(`/stores/search?q=${query}`);
    return response.data.data!.stores;
  }

  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<{ categories: Category[] }>>('/stores/categories');
    return response.data.data!.categories;
  }

  async getStoresByCategory(categorySlug: string, page = 1, limit = 20): Promise<PaginatedResponse<Store>> {
    const response = await api.get<ApiResponse<{
      category: Category;
      stores: Store[];
      pagination: any;
    }>>(`/stores/category/${categorySlug}?page=${page}&limit=${limit}`);
    
    return {
      data: response.data.data!.stores,
      pagination: response.data.data!.pagination,
    };
  }

  async visitStore(storeId: string, offerId?: string): Promise<{ clickId: string; redirectUrl: string }> {
    const params = offerId ? `?offerId=${offerId}` : '';
    const response = await api.post<ApiResponse<{ clickId: string; redirectUrl: string }>>(
      `/stores/${storeId}/visit${params}`
    );
    return response.data.data!;
  }
}

export default new StoreService();