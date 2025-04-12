import axios from 'axios';

const request = axios.create({
  timeout: 5000
});

// 请求拦截器（可选添加 token）
request.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

// API 封装
const api = {
  // 用户模块
  register: (user) => request.post('/api/user/register', user),

  login: (email, password) => request.post('/api/user/login', {
    email,
    password
  }),

  updatePassword: (userId, newPassword) => request.post('/api/user/update-password', {
    userId,
    newPassword
  }),

  getUserInfo: (userId) => request.get('/api/user/info', {
    params: { userId }
  }),

  completeProfile:(user) => request.post('/api/user/complete-profile', user),

  // 论文模块
  getAllPapers: () => request.get('/api/paper/all'),

  getUserPapers: (userId) => request.get(`/api/paper/by-user/${userId}`)
};

export default api;
