import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;