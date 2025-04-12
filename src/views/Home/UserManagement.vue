<template>
  <div class="user-management">
    <!-- 查询栏 -->
    <div class="search-bar">
      <input
        v-model="searchName"
        type="text"
        placeholder="Search by name"
        @input="searchUser"
      />

     <!-- 添加用户按钮 -->
       <button @click="addUser" class="primary">Add User</button>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pagedUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.gender }}</td>
            <td>{{ user.college }}</td>
            <td>

              <button :class="['primary', { 'dark-theme': isDarkMode }]" @click="editUser(user)">编辑</button>
              <button :class="['secondary', { 'dark-theme': isDarkMode }]" @click="deleteUser(user.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--" class="primary">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++" class="primary">Next</button>
    </div>

    <!-- 弹出窗口 - 编辑/添加用户 -->
      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <h3>{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
          <form @submit.prevent="handleSubmit">
            <label for="name">Name:</label>
            <input v-model="currentUser.name" type="text" id="name" required />

            <label for="email">Email:</label>
            <input v-model="currentUser.email" type="email" id="email" required />

            <label for="gender">Gender:</label>
            <select v-model="currentUser.gender">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label for="college">College:</label>
            <input v-model="currentUser.college" type="text" id="college" required />

            <button type="submit" class="primary">{{ isEditing ? 'Update' : 'Add' }}</button>
            <button @click="closeModal" type="button" class="cancel">Cancel</button>
          </form>
        </div>
      </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 用户数据（模拟数据，实际项目中会从 API 获取）
const users = ref([
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', gender: 'Male', college: 'Computer Science' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', gender: 'Female', college: 'Engineering' },
  { id: 3, name: 'Mary Johnson', email: 'mary.johnson@example.com', gender: 'Female', college: 'Mathematics' },
  { id: 4, name: 'James Brown', email: 'james.brown@example.com', gender: 'Male', college: 'Physics' },
  { id: 5, name: 'Patricia White', email: 'patricia.white@example.com', gender: 'Female', college: 'Biology' },
  { id: 6, name: 'Michael Green', email: 'michael.green@example.com', gender: 'Male', college: 'Chemistry' },
  { id: 7, name: 'Emily Clark', email: 'emily.clark@example.com', gender: 'Female', college: 'Philosophy' },
]);

// 管理数据
const searchName = ref('');
const currentPage = ref(1);
const pageSize = 5; // 每页显示5个用户
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentUser = ref({
  id: null,
  name: '',
  email: '',
  gender: 'Male',
  college: ''
});

// 模拟删除
const deleteUser = (id) => {
  users.value = users.value.filter(user => user.id !== id);
};

// 按姓名模糊查询
const searchUser = () => {
  currentPage.value = 1; // 重置分页为第一页
};

// 分页数据
const pagedUsers = computed(() => {
  const filteredUsers = users.value.filter(user => user.name.toLowerCase().includes(searchName.value.toLowerCase()));
  return filteredUsers.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
});

const totalPages = computed(() => {
  const filteredUsers = users.value.filter(user => user.name.toLowerCase().includes(searchName.value.toLowerCase()));
  return Math.ceil(filteredUsers.length / pageSize);
});

// 打开编辑/添加窗口
const editUser = (user) => {
  currentUser.value = { ...user };
  isEditing.value = true;
  isModalOpen.value = true;
};

const addUser = () => {
  currentUser.value = { id: null, name: '', email: '', gender: 'Male', college: '' };
  isEditing.value = false;
  isModalOpen.value = true;
};

// 关闭弹出窗口
const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

// 提交表单
const handleSubmit = () => {
  if (isEditing.value) {
    // 更新用户
    const index = users.value.findIndex(user => user.id === currentUser.value.id);
    users.value[index] = { ...currentUser.value };
  } else {
    // 添加用户
    currentUser.value.id = users.value.length + 1; // 简单模拟ID
    users.value.push({ ...currentUser.value });
  }
  closeModal();
};

// 重置表单
const resetForm = () => {
  currentUser.value = { id: null, name: '', email: '', gender: 'Male', college: '' };
};
</script>

<style scoped>
/* 用户管理页面的基本布局 */
.user-management {
  padding: 20px;
}

/* 整体暗色背景与字体 */
.dark-theme .user-management {
  background-color: #444;
  color: #eee;
}


.search-bar input {
  padding: 8px;
  font-size: 14px;
  width: 200px;
  margin-bottom: 20px;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
}

.user-list th, .user-list td {
  padding: 10px;
  text-align: left;
}

.user-list th {
  background-color: #f5f5f5;
}

.user-list td {
  border-top: 1px solid #ddd;
}

.dark-theme th,
.dark-theme td {
  padding: 10px;
  text-align: left;
  border-top: 1px solid #444; /* 单元格的上边框颜色 */
}

.dark-theme th {
  background-color: #555; /* 表头背景色 */
}

.dark-theme td {
  background-color: #444; /* 单元格背景色 */
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 400px;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.modal-content button.primary {
  background-color: #4caf50;
  color: white;
}

/* 暗模式下弹出窗口背景 */
.dark-theme .modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* 背景色稍暗 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 暗模式下弹出窗口内容 */
.dark-theme .modal-content {
  background-color: #333; /* 弹出窗口的背景色 */
  padding: 20px;
  border-radius: 6px;
  width: 400px;
  color: white; /* 文本颜色为白色 */
}

/* 弹出窗口标题 */
.dark-theme .modal-content h3 {
  margin-bottom: 20px;
  color: #f5f5f5; /* 标题颜色 */
}

/* 标签样式 */
.dark-theme .modal-content label {
  display: block;
  margin-bottom: 8px;
  color: #f5f5f5; /* 标签文字颜色 */
}

/* 输入框样式 */
.dark-theme .modal-content input,
.dark-theme .modal-content select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #555; /* 边框颜色 */
  border-radius: 4px;
  background-color: #444; /* 输入框背景色 */
  color: white; /* 输入框文字颜色 */
}

/* 输入框和选择框的焦点颜色 */
.dark-theme .modal-content input:focus,
.dark-theme .modal-content select:focus {
  border-color: #4caf50; /* 聚焦时边框颜色 */
  outline: none; /* 去除聚焦时的外边框 */
}

/* 按钮样式 */
.dark-theme .modal-content button.primary {
  background-color: #222; /* 提交按钮背景色 */
  color: white;
}

.dark-theme .modal-content button.cancel {
  background-color: #888; /* 取消按钮背景色 */
  color: white;
}

.dark-theme .modal-content button.primary:hover,
.dark-theme .modal-content button.cancel:hover {
  background-color: #4caf50; /* 暗模式下的按钮悬停效果 */
}

/* 按钮禁用状态 */
.dark-theme .modal-content button:disabled {
  background-color: #555;
  cursor: not-allowed; /* 禁用按钮样式 */
}


.dark-theme .primary {
  background-color: #333; /* 暗模式下的按钮背景色 */
  color: white;
}

.dark-theme .primary:hover {
  background-color: #4caf50; /* 暗模式下的按钮悬停效果 */
}

.dark-theme .secondary {
  background-color: #444; /* 暗模式下的删除按钮 */
  color: white;
}

.dark-theme .secondary:hover {
  background-color: #f44336;
}


.modal-content button.secondary {
  background-color: #f44336;
  color: white;
}



.modal-content button.cancel {
  background-color: #ccc;
  color: #333;
}

.modal-content button:hover {
  opacity: 0.8;
}

/* 按钮统一样式 */
button.primary {
  background-color: #4caf50;
  color: white;
}

button.secondary {
  background-color: #f44336;
  color: white;
}

button.cancel {
  background-color: #ccc;
  color: #333;
}

button.primary:hover, button.secondary:hover, button.cancel:hover {
  opacity: 0.8;
}

button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}


</style>
