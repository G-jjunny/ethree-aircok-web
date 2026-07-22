import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      if (!window.location.pathname.startsWith('/console/login')) {
        window.location.href = '/console/login';
      }
    }
    return Promise.reject(error);
  },
);

export { axiosInstance };
