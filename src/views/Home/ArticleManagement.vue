<template>
  <div class="article-management">
    <!-- 用户列表和柱状图部分，只有在未选择用户时显示 -->
    <div v-if="!selectedUser" class="left-panel">
      <h2>User Articles</h2>
      <UserArticleTable
        :users="users"
        :current-page="currentPage"
        :page-size="pageSize"
        @select-user="selectUser"
      />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="changePage"
      />
    </div>

    <div v-if="!selectedUser" class="right-panel">
      <h2>Article Statistics</h2>
      <!-- 只有在有数据时显示图表 -->
      <article-chart v-if="articleChartData.length > 0" :data="articleChartData" />
      <p v-else v-if="users.length === 0">No users available</p>
      <p v-else>Loading...</p> <!-- 加载中的状态 -->
    </div>

    <!-- 用户详情和文章信息部分，只有在选择用户后显示 -->
    <div v-if="selectedUser" class="user-details">
      <button @click="goBack" class="back-button cancel">Back to User List</button>
      <div class="user-info">
        <img :src="selectedUser.avatar" alt="Avatar" />
        <h3>{{ selectedUser.name }}</h3>
        <p>Articles: {{ selectedUser.articleCount }}</p>
      </div>
      <article-list :articles="selectedUserArticles" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import UserArticleTable from '../../components/UserArticleTable.vue';
import ArticleChart from '../../components/ArticleChart.vue';
import ArticleList from '../../components/ArticleList.vue';
import Pagination from '../../components/Pagination.vue';
import api from '../../api/index.js';

const users = ref([]);         // 当前页用户及其文章数量
const articles = ref([]);      // 选中用户的文章
const total = ref(0);          // 总用户数
const currentPage = ref(1);
const pageSize = 3;            // 每页显示用户数
const selectedUser = ref(null); // 当前选中的用户
const isLoading = ref(false);   // 加载状态

// 加载用户统计信息
const loadUserPaperStats = async () => {
  isLoading.value = true; // 开始加载
  try {
    const res = await api.getUsersWithPaperCount(currentPage.value, pageSize);
    users.value = res.records;
    total.value = res.total;
  } catch (err) {
    console.error('加载失败', err);
    users.value = [];  // 如果加载失败，清空用户列表
  } finally {
    isLoading.value = false; // 完成加载
  }
};

// 加载选中用户的文章
const loadUserArticles = async (userId) => {
  try {
    const res = await api.getUserPapers(userId);
    articles.value = res;
  } catch (err) {
    console.error('获取用户文章失败', err);
  }
};

// 用户文章柱状图数据
const articleChartData = computed(() => {
  return users.value.map(user => ({
    label: user.username,
    value: user.paperCount
  }));
});

// 当前选中用户的文章（已过滤 userId）
const selectedUserArticles = computed(() => {
  if (!selectedUser.value) return [];
  return articles.value.filter(article => article.userId === selectedUser.value.id);
});

// 分页总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize));

// 选中用户（并加载其文章）
const selectUser = (user) => {
  selectedUser.value = user;
  loadUserArticles(user.id);  // 加载文章
};

// 分页变化
const changePage = (newPage) => {
  currentPage.value = newPage;
  loadUserPaperStats();  // 更新用户列表
};

// 返回上一页
const goBack = () => {
  selectedUser.value = null;
};

// 初始化加载第一页用户论文统计
onMounted(() => {
  loadUserPaperStats();
});

// 监听分页变化，触发数据更新
watch(currentPage, () => {
  loadUserPaperStats();
});
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






