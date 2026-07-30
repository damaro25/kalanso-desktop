import axios from 'axios';

export const apiClient = axios.create({
  // Toujours même origine : frontend et backend sont servis par le même
  // processus Electron/NestJS local, jamais de serveur distant.
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kalanso_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kalanso_token');
      localStorage.removeItem('kalanso_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
