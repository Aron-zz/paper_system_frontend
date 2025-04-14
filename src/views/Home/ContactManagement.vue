<template>
  <div class="contact-management">
    <!-- 查询栏 -->
    <div class="search-bar">
      <input
        v-model="searchName"
        type="text"
        placeholder="Search by name"
        @input="searchContact"
      />

      <!-- 添加联系人按钮 -->
      <button @click="addContact" class="primary">Add Contact</button>
    </div>

    <!-- 联系人列表 -->
    <div class="contact-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Relationship</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in pagedContacts" :key="contact.id">
            <td>{{ contact.name }}</td>
            <td>{{ contact.phone }}</td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.relationship }}</td>
            <td>
              <button :class="['primary', { 'dark-theme': isDarkMode }]" @click="editContact(contact)">Edit</button>
              <button :class="['secondary', { 'dark-theme': isDarkMode }]" @click="deleteContact(contact.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
   <div class="pagination">
     <button
       :disabled="currentPage === 1"
       @click="currentPage--; loadData();"
       class="primary"
     >
       Prev
     </button>
     <span>Page {{ currentPage }} of {{ totalPages }}</span>
     <button
       :disabled="currentPage === totalPages"
       @click="currentPage++; loadData();"
       class="primary"
     >
       Next
     </button>
   </div>

    <!-- 弹出窗口 - 编辑/添加联系人 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Contact' : 'Add Contact' }}</h3>
        <form @submit.prevent="handleSubmit">
          <label for="name">Name:</label>
          <input v-model="currentContact.name" type="text" id="name" required />

          <label for="phone">Phone:</label>
          <input v-model="currentContact.phone" type="text" id="phone" />

          <label for="email">Email:</label>
          <input v-model="currentContact.email" type="email" id="email" />

          <label for="relationship">Relationship:</label>
          <input v-model="currentContact.relationship" type="text" id="relationship" />

          <button type="submit" class="primary">{{ isEditing ? 'Update' : 'Add' }}</button>
          <button @click="closeModal" type="button" class="cancel">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import api from '../../api/index.js'; // 引入之前提供的 API 封装

// 状态管理
const searchName = ref('');
const currentPage = ref(1);
const pageSize = 5; // 每页显示5个联系人
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentContact = ref({
  id: '',
  userId: '',
  name: '',
  phone: '',
  email: '',
  relationship: ''
});

// 加载用户信息并验证 ID
const userId = localStorage.getItem('id');


// 获取联系人列表并分页
const getContacts = async (page = currentPage.value, size = pageSize) => {
  try {
    const response = await api.getContactsByUserId(userId, page, size);
    contacts.value = response.records;
    currentPage.value = response.current;  // 这里同步后端的 current

    totalPages.value = Math.ceil(response.total / pageSize);
    console.log('返回获取的联系人信息:', response);
  } catch (error) {
    console.error('Error fetching contacts:', error);
  }
};

const searchContact = () => {
  currentPage.value = 1;
  // 调用搜索接口，而不是普通分页接口
  loadSearchResults();
};

const loadSearchResults = async () => {
  try {
    const response = await api.searchContactsByName(
      userId,
      searchName.value, // 搜索关键词
      currentPage.value,
      pageSize
    );
    contacts.value = response.records;
    totalPages.value = Math.ceil(response.total / pageSize);
  } catch (error) {
    console.error("搜索失败:", error);
  }
};

// 删除联系人
const deleteContact = async (id) => {
  try {
    console.log('发送删除请求 ID:', id); // 打印出要删除的 ID
    await api.deleteContact(id);
    getContacts(); // 删除成功后重新加载联系人列表
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
};

// 分页数据
const contacts = ref([]);
const totalPages = ref(1);

const pagedContacts = computed(() => {
  return contacts.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
});

// 打开编辑/添加窗口
const editContact = (contact) => {
  currentContact.value = { ...contact };
  isEditing.value = true;
  isModalOpen.value = true;
};

const addContact = () => {
  currentContact.value = { id: '', name: '', phone: '', email: '', relationship: '' };
  isEditing.value = false;
  isModalOpen.value = true;
};

// 关闭弹出窗口
const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

// 提交表单（更新或添加联系人）
const handleSubmit = async () => {
  try {
  // 在添加联系人时，排除 id 字段
    currentContact.value.userId = userId;
    const contactData = { ...currentContact.value };
    if (!isEditing.value) {
      delete contactData.id;  // 添加联系人时删除 id 字段
    }

    if (isEditing.value) {

      await api.updateContact(contactData); // 更新联系人
    } else {

      await api.addContact(contactData); // 添加联系人
    }
    closeModal();
    getContacts(); // 提交后重新加载联系人列表
  } catch (error) {
    console.error('Error submitting contact:', error);
  }
};

const loadData = async () => {
  if (searchName.value) {
    await loadSearchResults(); // 如果有搜索词，调用搜索接口
  } else {
    await getContacts(); // 否则调用普通分页接口
  }
};

// 监听 currentPage，自动加载数据
watch(currentPage, (newPage) => {
  loadData(); // 翻页时调用统一的数据加载方法
});


// 重置表单
const resetForm = () => {
  currentContact.value = { id: null, name: '', phone: '', email: '', relationship: '' };
};

onMounted(() => {
  getContacts(currentPage.value);
});

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
