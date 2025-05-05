<template>
  <div class="article-management">
    <!-- 用户列表和统计图表部分 -->
    <div v-if="!selectedUser" class="main-content">
      <el-row :gutter="20">
        <!-- 用户列表 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <h2>论文统计</h2>
                <el-button 
                  type="primary" 
                  @click="refreshData"
                  :loading="isLoading"
                >
                  <el-icon><Refresh /></el-icon> Refresh
                </el-button>
              </div>
            </template>
            <UserArticleTable 
              :users="allUsers" 
              @select-user="selectUser"
              @page-change="handlePageChange"
              @update-visible-users="handleVisibleUsersUpdate"
              :loading="isLoading"
            />
      
          </el-card>
        </el-col>

        <!-- 统计图表 -->
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="chart-header">
                <h2>Article Statistics</h2>
                <el-statistic 
                  title="Total Articles" 
                  :value="totalArticles" 
                  class="total-statistic"
                />
              </div>
            </template>
            <EChartComponent 
              v-if="currentPageUsers.length > 0" 
              :options="chartOptions"
              class="chart-container"
              :key="chartKey"
            />
            <el-empty v-else description="No users available" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 用户详情和文章列表 -->
    <div v-if="selectedUser" class="user-details">
      <el-card>
        <template #header>
          <div class="user-header">
            <el-button 
              type="info" 
              @click="goBack" 
              class="back-button"
            >
              <el-icon><ArrowLeft /></el-icon> 返回文章管理
            </el-button>
            
          </div>
        </template>

        <!-- 用户信息 -->
        <div class="user-info">
          <el-avatar :size="80" :src="selectedUser.avatarUrl || '/default-avatar.png'" />
          <div class="user-meta">
            <h3>{{ selectedUser.name }}</h3>
            <p>
              <el-icon><Message /></el-icon> 
              {{ selectedUser.email }}
            </p>
            <p>
              <el-icon><OfficeBuilding /></el-icon> 
              {{ selectedUser.organization || 'No organization' }}
            </p>
            <p>
              <el-icon><Document /></el-icon>
              Total Articles: {{ selectedUser.paperCount || 0 }}
            </p>
          </div>
        </div>

        <!-- 文章列表 -->
        <ArticleList
          :articles="selectedUserArticles"
          :loading="articlesLoading"
          @add="handleAddArticle"
          @edit="handleEditArticle"
          @delete="handleDeleteArticle"
        />
      </el-card>
    </div>

    <!-- 添加/编辑文章对话框 -->
    <el-dialog
      v-model="articleDialogVisible"
      :title="isEditingArticle ? 'Edit Article' : 'Add Article'"
      width="50%"
    >
      <ArticleForm
        v-if="articleDialogVisible"
        :article="currentArticle"
        @submit="handleArticleSubmit"
        @cancel="articleDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowLeft, Message, OfficeBuilding, Document, Refresh 
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import UserArticleTable from '../../components/UserArticleTable.vue'
import ArticleList from '../../components/ArticleList.vue'
import ArticleForm from '../../components/ArticleForm.vue'
import EChartComponent from '../../components/EChartComponent.vue'
import api from '../../api/index.js'

// 状态管理
const users = ref([])
const allUsers = ref([]) // 存储所有用户数据
const articles = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUser = ref(null)
const isLoading = ref(false)
const articlesLoading = ref(false)
const articleDialogVisible = ref(false)
const currentArticle = ref({})
const isEditingArticle = ref(false)
const chartKey = ref(0) // 用于强制重新渲染图表


const visibleUsers = ref([])

const handleVisibleUsersUpdate = (users) => {
  visibleUsers.value = users
  chartKey.value++  // 每次用户变化，强制刷新一次图表
}


// 计算当前页显示的用户
const currentPageUsers = computed(() => visibleUsers.value)


// 计算属性
const selectedUserArticles = computed(() => articles.value)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const totalArticles = computed(() => 
  allUsers.value.reduce((sum, user) => sum + (user.paperCount || 0), 0)
)

const chartOptions = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b}: {c} articles'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: currentPageUsers.value.map(user => user.username),
    axisLabel: {
      rotate: 45,
      interval: 0,
      formatter: (value) => {
        return value.length > 8 ? value.substring(0, 6) + '...' : value
      }
    }
  },
  yAxis: {
    type: 'value',
    name: 'Article Count',
    minInterval: 1
  },
  series: [{
    name: 'Articles',
    type: 'bar',
    barWidth: '60%',
    data: currentPageUsers.value.map(user => user.paperCount),
    itemStyle: {
      color: '#83bff6',
      borderRadius: [4, 4, 0, 0]
    },
    label: {
      show: true,
      position: 'top'
    }
  }]
}))

watch(currentPageUsers, (val) => {
  console.log('currentPageUsers:', val)
})


// 加载用户数据
const loadUserPaperStats = async () => {
  isLoading.value = true
  try {
    const res = await api.getUsersWithPaperCount()
    allUsers.value = res.records || [] // 存储所有用户数据
    users.value = [...allUsers.value] // 复制一份用于分页
    total.value = res.total || 0
    // 强制图表重新渲染
    chartKey.value++
  } catch (err) {
    ElMessage.error('Failed to load user data')
    console.error('Error loading user stats:', err)
  } finally {
    isLoading.value = false
  }
}

// 加载用户文章
const loadUserArticles = async (userId) => {
  articlesLoading.value = true
  try {
    const res = await api.getUserPapers(userId)
    articles.value = res || []
  } catch (err) {
    ElMessage.error('Failed to load articles')
    console.error('Error loading articles:', err)
  } finally {
    articlesLoading.value = false
  }
}

// 加载用户详情
const loadUserInfo = async (userId) => {
  try {
    const res = await api.getUserInfo(userId)
    selectedUser.value = { 
      ...selectedUser.value, 
      ...res,
      avatar: res.avatar || '/default-avatar.png'
    }
  } catch (err) {
    ElMessage.error('Failed to load user info')
    console.error('Error loading user info:', err)
  }
}

// 选择用户
const selectUser = (user) => {
  selectedUser.value = user
  loadUserInfo(user.userId)
  loadUserArticles(user.userId)
}

// 分页变化
const changePage = (page) => {
  currentPage.value = page
  // 不需要重新加载数据，因为我们已经有所有数据
  chartKey.value++ // 强制图表更新
}

// 每页大小变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  chartKey.value++ // 强制图表更新
}

// 刷新数据
const refreshData = () => {
  if (selectedUser.value) {
    loadUserInfo(selectedUser.value.userId)
    loadUserArticles(selectedUser.value.userId)
  } else {
    loadUserPaperStats()
  }
}

// 返回用户列表
const goBack = () => {
  selectedUser.value = null
}

// 删除文章
const handleDeleteArticle = async (articleId) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure to delete this article?', 
      'Warning', 
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await api.deletePaper(articleId)
    articles.value = articles.value.filter(article => article.id !== articleId)
    
    // 更新用户统计
    const userIndex = allUsers.value.findIndex(u => u.userId === selectedUser.value.userId)
    if (userIndex !== -1) {
      allUsers.value[userIndex].paperCount--
      users.value = [...allUsers.value]
      chartKey.value++
    }
    
    ElMessage.success('Article deleted successfully')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('Delete failed')
      console.error('Error deleting article:', err)
    }
  }
}

// 编辑文章
const handleEditArticle = (article) => {
  currentArticle.value = { ...article }
  isEditingArticle.value = true
  articleDialogVisible.value = true
}

// 添加文章
const handleAddArticle = () => {
  currentArticle.value = {
    title: '',
    content: '',
    status: 'draft',
    userId: selectedUser.value.userId
  }
  isEditingArticle.value = false
  articleDialogVisible.value = true
}

// 提交文章表单
const handleArticleSubmit = async (articleData) => {
  try {
    if (isEditingArticle.value) {
      await api.updatePaper(articleData)
      articles.value = articles.value.map(a => 
        a.id === articleData.id ? articleData : a
      )
      ElMessage.success('Article updated successfully')
    } else {
      const res = await api.addUserPaper(selectedUser.value.userId, articleData)
      const newArticle = { ...articleData, id: res.paperId }
      articles.value = [...articles.value, newArticle]
      
      // 更新用户统计
      const userIndex = allUsers.value.findIndex(u => u.userId === selectedUser.value.userId)
      if (userIndex !== -1) {
        allUsers.value[userIndex].paperCount++
        users.value = [...allUsers.value]
        chartKey.value++
      }
      
      ElMessage.success('Article added successfully')
    }
    articleDialogVisible.value = false
  } catch (err) {
    ElMessage.error('Operation failed')
    console.error('Error submitting article:', err)
  }
}

// 分页变化处理
const handlePageChange = ({ currentPage, pageSize }) => {
  currentPage.value = currentPage
  pageSize.value = pageSize
  chartKey.value++ // 强制更新图表
}

// 生命周期钩子
onMounted(() => {
  loadUserPaperStats()
})
</script>

<style scoped>
/* 保持原有的样式不变 */
.article-management {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-content {
  display: flex;
  gap: 20px;
}

.user-details {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
}

.user-meta {
  flex: 1;
}

.user-meta h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.user-meta p {
  margin: 6px 0;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.back-button {
  margin-bottom: 16px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h2 {
  margin: 0;
}

.total-statistic {
  margin-left: 16px;
}

.chart-container {
  width: 100%;
  height: 350px;
  min-height: 350px;
}

.el-card {
  margin-bottom: 20px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .el-col {
    width: 100%;
    max-width: 100%;
  }
  
  .chart-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .total-statistic {
    margin-left: 0;
    margin-top: 8px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>