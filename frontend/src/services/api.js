import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for agent tasks
  headers: { 'Content-Type': 'application/json' },
});

// Inject user_id into every request header
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('mrpl_user_id');
  if (userId) config.headers['X-User-Id'] = userId;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    api.post('/api/auth/login', { username, password }).then(r => r.data),

  me: () =>
    api.get('/api/auth/me').then(r => r.data),
};

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const tasksAPI = {
  list: (userId) =>
    api.get('/api/tasks', { params: { user_id: userId } }).then(r => r.data),

  get: (taskId) =>
    api.get(`/api/tasks/${taskId}`).then(r => r.data),
};

// ─── Chat / Agent ─────────────────────────────────────────────────────────────
export const chatAPI = {
  send: (message, userId, fileName = null) =>
    api.post('/api/chat', {
      message,
      user_id: userId,
      file_name: fileName,
    }).then(r => r.data),
};

// ─── Models ──────────────────────────────────────────────────────────────────
export const modelsAPI = {
  list: () => api.get('/api/models').then(r => r.data),
  registry: () => api.get('/api/models/registry').then(r => r.data),
};

// ─── Knowledge ───────────────────────────────────────────────────────────────
export const knowledgeAPI = {
  collections: (userId) =>
    api.get('/api/knowledge', { params: { user_id: userId } }).then(r => r.data),
};

// ─── Egress / Sovereignty ────────────────────────────────────────────────────
export const egressAPI = {
  summary: () => api.get('/api/egress/summary').then(r => r.data),
  log: () => api.get('/api/egress/log').then(r => r.data),
};

// ─── System ──────────────────────────────────────────────────────────────────
export const systemAPI = {
  status: () => api.get('/api/system/status').then(r => r.data),
  health: () => api.get('/api/health').then(r => r.data),
};

// ─── Audit ───────────────────────────────────────────────────────────────────
export const auditAPI = {
  list: (taskId) =>
    api.get('/api/audit', { params: taskId ? { task_id: taskId } : {} }).then(r => r.data),
};

export default api;
