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

  // 修改密码接口
    resetPassword: (email, newPassword) =>
      request.post('/api/user/reset-password', null, {
        params: { email, newPassword }
      }),

  getUserInfo: (userId) => request.post('/api/user/info', { userId }),


  completeProfile:(user) => request.post('/api/user/complete-profile', user),

  updateUserInfo: (user) => request.post('/api/user/update', user),

  // 上传头像
    uploadAvatar: (file, userId) => {
      const formData = new FormData();
      formData.append('file', file);  // 后端接收字段名为 'file'
      formData.append('userId', userId);

      return request.post('/api/user/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'  // 设置请求头为 multipart/form-data
        }
      });
    },

  // 论文模块
  getAllPapers: () => request.get('/api/paper/all'),

  getUserPapers: (userId) => request.get(`/api/paper/by-user/${userId}`),

  // 每个用户发表的论文数
  getUsersWithPaperCount: (page = 1, size = 10) =>
    request.get('/api/user-paper/user-count', {
      params: { page, size }
    }),
};



export default api;
