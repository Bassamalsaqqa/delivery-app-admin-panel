import axios from 'axios';

/**
 * Axios instance preconfigured with the API base URL and an interceptor
 * that automatically attaches the JWT token from localStorage to every request.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      // Attach the JWT token as a Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Optional response interceptor could be added here to handle global errors
 * such as expired tokens.
 */