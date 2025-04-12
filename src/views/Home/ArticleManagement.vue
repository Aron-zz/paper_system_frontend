<template>
  <div class="article-management">
    <!-- 用户列表和柱状图部分，只有在未选择用户时显示 -->
    <div v-if="!selectedUser" class="left-panel">
      <h2>User Articles</h2>
      <user-article-table :users="paginatedUsers" :current-page="currentPage" @select-user="selectUser" />
      <pagination :current-page="currentPage" :total-pages="totalPages" @change-page="changePage" />
    </div>

    <div v-if="!selectedUser" class="right-panel">
      <h2>Article Statistics</h2>
      <article-chart :data="articleChartData" />
    </div>

    <!-- 用户详情和文章信息部分，只有在选择用户后显示 -->
    <div v-if="selectedUser" class="user-details">
      <button @click="goBack" class="back-button cancel">Back to User List</button>
      <div class="user-info">
        <img :src="selectedUser.avatar" alt="Avatar" />
        <h3>{{ selectedUser.name }}</h3>
        <p>Articles: {{ selectedUser.articles }}</p>
      </div>
      <article-list :articles="selectedUserArticles" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import UserArticleTable from '../../components/UserArticleTable.vue';
import ArticleChart from '../../components/ArticleChart.vue';
import ArticleList from '../../components/ArticleList.vue';
import Pagination from '../../components/Pagination.vue';

// 用户数据和文章数据（实际应该从后端 API 获取）
const users = ref([
  { id: 1, name: 'John Doe', avatar: 'user1.jpg', articles: 5 },
  { id: 2, name: 'Jane Smith', avatar: 'user2.jpg', articles: 8 },
  { id: 3, name: 'Mary Johnson', avatar: 'user3.jpg', articles: 3 },
  { id: 4, name: 'James Brown', avatar: 'user4.jpg', articles: 10 },
  { id: 5, name: 'Alice Cooper', avatar: 'user5.jpg', articles: 7 },
  { id: 6, name: 'Bob Lee', avatar: 'user6.jpg', articles: 4 },
]);

const articles = ref([
  { userId: 1, title: 'Article 1', content: 'Content of Article 1' },
  { userId: 2, title: 'Article 2', content: 'Content of Article 2' },
  { userId: 3, title: 'Article 3', content: 'Content of Article 3' },
  { userId: 4, title: 'Article 4', content: 'Content of Article 4' },
  { userId: 5, title: 'Article 5', content: 'Content of Article 5' },
  { userId: 6, title: 'Article 6', content: 'Content of Article 6' },
]);

const currentPage = ref(1);
const pageSize = 3; // 每页显示3个用户
const selectedUser = ref(null);

// 分页后的用户数据
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  return users.value.slice(startIndex, startIndex + pageSize);
});

// 用户文章数量柱状图的数据
const articleChartData = computed(() => {
  return users.value.map(user => ({
    label: user.name,
    value: user.articles,
  }));
});

// 选中的用户的文章列表
const selectedUserArticles = computed(() => {
  if (!selectedUser.value) return [];
  return articles.value.filter(article => article.userId === selectedUser.value.id);
});

// 分页数据
const totalPages = computed(() => Math.ceil(users.value.length / pageSize));

// 选择用户
const selectUser = (user) => {
  selectedUser.value = user;
};

// 切换页面
const changePage = (newPage) => {
  currentPage.value = newPage;
};

// 返回上一级
const goBack = () => {
  selectedUser.value = null; // 清空选中的用户，回到用户列表
};
</script>

<style scoped>
.article-management {
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.left-panel,
.right-panel {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
}

.user-details {
  flex: 1 1 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.user-info img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

/* 输入框样式 */
.search-bar input {
  padding: 8px;
  font-size: 14px;
  width: 200px;
  margin-bottom: 20px;
}

/* 表格样式 */
.article-list table {
  width: 100%;
  border-collapse: collapse;
}

.article-list th,
.article-list td {
  padding: 10px;
  text-align: left;
  border-top: 1px solid #ddd;
}

.article-list th {
  background-color: #f5f5f5;
}

/* 分页样式 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease;
  border: none;
  border-radius: 4px;
  margin: 0 4px;
}

/* 模态框样式 */
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

/* 按钮统一样式 */
button,
button.primary,
button.secondary,
button.cancel,
.back-button {
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s ease, opacity 0.3s ease;
}

/* 各类按钮颜色 */
button.primary {
  background-color: #4caf50;
  color: white;
}

button.secondary {
  background-color: #f44336;
  color: white;
}

button.cancel,
.back-button {
  background-color: #ccc;
  color: #333;
}

/* 悬停效果（亮色主题） */
button:hover,
button.primary:hover,
button.secondary:hover,
button.cancel:hover,
.back-button:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

/* 禁用状态 */
button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.5;
}

/* 暗模式 */
.dark-theme .article-management {
  background-color: #444;
  color: #eee;
}

.dark-theme .left-panel,
.dark-theme .right-panel,
.dark-theme .user-details {
  background-color: #333;
  color: white;
}

.dark-theme .article-list th {
  background-color: #555;
}

.dark-theme .article-list td {
  background-color: #444;
  border-top: 1px solid #555;
}

/* 按钮暗模式颜色 */
.dark-theme button.primary {
  background-color: #222;
  color: white;
}

.dark-theme button.secondary {
  background-color: #d32f2f;
  color: white;
}

.dark-theme button.cancel,
.dark-theme .back-button {
  background-color: #888;
  color: white;
}

/* 按钮悬停（暗模式） */
.dark-theme button:hover,
.dark-theme button.primary:hover,
.dark-theme button.secondary:hover,
.dark-theme button.cancel:hover,
.dark-theme .back-button:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

/* 输入框暗模式 */
.dark-theme input,
.dark-theme select {
  background-color: #444;
  color: white;
  border: 1px solid #555;
}

.dark-theme input:focus,
.dark-theme select:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.8);
}
</style>






