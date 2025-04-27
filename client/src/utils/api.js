// client/src/utils/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // .env’de tanımlı API URL’i (ör. https://recyclewise-api.onrender.com)
});

// Her isteğe, eğer localStorage’da token varsa, Authorization header’ı ekleyen interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
