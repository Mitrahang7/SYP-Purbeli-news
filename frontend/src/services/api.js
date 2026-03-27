import axios from 'axios';
import { getToken, logoutUser } from './auth';

const API_BASE = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Use JWT prefix or Bearer prefix based on the backend setting
      // simplejwt uses Bearer by default
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt token refresh if 401 is encountered
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/token/refresh/') {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token is expired or invalid
          logoutUser();
          // window.location.reload(); 
          return Promise.reject(refreshError);
        }
      } else {
        logoutUser();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
