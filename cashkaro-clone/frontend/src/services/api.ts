import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshTokens(refreshToken);
              this.setTokens(response.data.tokens);
              originalRequest.headers.Authorization = `Bearer ${response.data.tokens.accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
          }
        }

        const message = (error.response?.data as any)?.message || 'An error occurred';
        toast.error(message);

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(tokens: { accessToken: string; refreshToken: string }): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private async refreshTokens(refreshToken: string) {
    return this.axiosInstance.post('/auth/refresh-token', { refreshToken });
  }

  get(url: string, config?: any) {
    return this.axiosInstance.get(url, config);
  }

  post(url: string, data?: any, config?: any) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url: string, data?: any, config?: any) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url: string, config?: any) {
    return this.axiosInstance.delete(url, config);
  }

  patch(url: string, data?: any, config?: any) {
    return this.axiosInstance.patch(url, data, config);
  }
}

export default new ApiService();