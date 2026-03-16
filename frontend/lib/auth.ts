import { api } from './api';

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

export const forceLogout = () => {
  removeAccessToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

export const logoutUser = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    forceLogout();
  }
};

export const setUserInfo = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUserInfo = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};
