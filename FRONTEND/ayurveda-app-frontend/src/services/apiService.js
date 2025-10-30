import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use(async (config) => {
  const { useAuth } = await import('react-oidc-context');
  const auth = useAuth();
  if (auth.isAuthenticated) {
    config.headers.Authorization = `Bearer ${auth.user.access_token}`;
  }
  return config;
});

export const analyzeDosha = (data) => api.post('/analyze', data);
export const getHistory = () => api.get('/history');