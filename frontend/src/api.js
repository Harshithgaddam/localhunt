import axios from 'axios';

// Create the axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

export default api;