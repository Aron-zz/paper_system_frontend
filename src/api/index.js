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

    // 删除论文
    deletePaper: (paperId) => request.delete(`/api/paper/delete/${paperId}`),

    // 更新论文
    updatePaper: (paper) => request.put('/api/paper/update', paper),

    // 新增论文
    addPaper: (paper) => request.post('/api/paper/add', paper),  // 新增论文接口

    // 新增论文并关联用户（包含作者顺序、贡献）
    addUserPaper: (userId, paperData) =>
      request.post(`/api/paper/${userId}/papers`, paperData),

    // 根据用户ID和论文标题进行模糊查询
    searchPapers: (userId, query) => request.get('/api/paper/search', {
      params: { userId, query }
    }),


  // 每个用户发表的论文数
  // 获取所有用户及其论文数量信息（取消后端分页）
getUsersWithPaperCount: () =>
  request.get('/api/user-paper/user-count'),



// 改为获取所有联系人（不传 page、size 参数）
getAllContactsByUserId: (userId) =>
  request.get(`/api/contacts/by-user/${userId}`)
,

// 2. 模糊搜索联系人姓名（userId + name）
searchContactsByName: (userId, keyword, page, size) =>
  request.get('/api/contacts/search', {
    params: { userId, keyword, page, size }
  }),

// 3. 新增联系人
addContact: (contact) => request.post('/api/contacts', contact),

// 4. 修改联系人
updateContact: (contact) => request.put('/api/contacts', contact),

// 5. 删除联系人
deleteContact: (contactId) =>
  request.delete(`/api/contacts/${contactId}`)

};

export default api;
