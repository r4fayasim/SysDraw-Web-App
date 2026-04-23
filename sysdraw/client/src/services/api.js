/**
 * SysDraw - API Service
 * Centralized Axios instance for all HTTP requests to the backend
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach stored token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sysdraw_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const projectAPI = {
  list: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addComment: (id, text) => api.post(`/projects/${id}/comments`, { text }),
};

// ─── Diagrams ─────────────────────────────────────────────────────────────────
export const diagramAPI = {
  load: (projectId, pageId) => api.get(`/diagrams/${projectId}/pages/${pageId}`),
  save: (projectId, pageId, elements) =>
    api.post(`/diagrams/${projectId}/pages/${pageId}/save`, { elements }),
  addPage: (projectId, name) => api.post(`/diagrams/${projectId}/pages`, { name }),
  export: (projectId, format, elements) =>
    api.post(`/diagrams/${projectId}/export`, { format, elements }),
};

export default api;
