import axios from 'axios';
import { getAccessToken, setAccessToken, forceLogout } from './auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true, // for refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops if refresh itself fails
    if (originalRequest.url?.includes('/api/auth/refresh') || originalRequest.url?.includes('/api/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh`,
            {},
            { withCredentials: true }
        );
        
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        forceLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
