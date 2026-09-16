import axios from 'axios';
import { env } from '@/app/config/env';
import { normalizeApiError } from './errorNormalizer';
import { authStorage } from '@/services/auth/authStorage';


export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeApiError(error);

    if (normalizedError.status === 401) {
      authStorage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(normalizedError);
  }
);
