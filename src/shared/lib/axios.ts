import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      if (!window.location.pathname.startsWith('/console/login')) {
        window.location.href = '/console/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
