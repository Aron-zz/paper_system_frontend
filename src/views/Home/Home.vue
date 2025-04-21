<template>
  <div :class="[themeClass, { dark: isDarkMode }]" class="home">
    <!-- Element Plus 侧边栏 -->
    <el-container class="layout-container">
      <el-aside 
        :width="collapsed ? '64px' : '250px'" 
        class="sidebar" 
        :style="{backgroundColor: sidebarBgColor }"
      >
        <el-menu
          :collapse="collapsed"
          :background-color="isDarkMode ? '#1f1f1f' : '#fff'"
          :text-color="isDarkMode ? '#fff' : '#333'"
          active-text-color="#409EFF"
          :collapse-transition="false"
          router
        >
          <el-menu-item index="/home/user-profile">
            <el-icon><User /></el-icon>
            <template #title>个人信息</template>
          </el-menu-item>
          <el-menu-item index="/home/contact-management">
            <el-icon><List /></el-icon>
            <template #title>联系人管理</template>
          </el-menu-item>
          <el-menu-item index="/home/article-management">
            <el-icon><Document /></el-icon>
            <template #title>文章管理</template>
          </el-menu-item>

          <!-- 主题选择 -->
          <div style="padding: 10px;">
            <el-select v-model="theme" placeholder="选择主题" @change="changeTheme" size="small" style="width: 120px;">
              <el-option label="蓝色主题" value="blue" />
              <el-option label="黄色主题" value="light" />
              
            </el-select>
          </div>
        </el-menu>
        
        <div class="sidebar-footer">
          <el-button 
            @click="toggleSidebar" 
            :icon="collapsed ? 'i-ep-Expand' : 'i-ep-Fold'" 
            circle 
            size="small"
          />
          <el-switch
            v-model="isDarkMode"
            @change="toggleTheme"
            inline-prompt
            :active-icon="iEpSunny"
            :inactive-icon="iEpMoon"
            style="margin-left: 10px"
          />
        </div>
      </el-aside>

      <el-container class="main-container">
        <!-- Element Plus 导航栏 -->
        <el-header class="navbar">
          <div class="navbar-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>当前页面</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="navbar-right">
            <el-tag type="info">{{ currentTime }}</el-tag>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :size="30" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <span style="margin-left: 5px">用户名</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <!-- 路由内容 -->
          <div class="router-view-container">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/index.js'
import {
  User,
  List,
  Document,
  Expand as iEpExpand,
  Fold as iEpFold,
  Sunny as iEpSunny,
  Moon as iEpMoon
} from '@element-plus/icons-vue'

const router = useRouter()

const isDarkMode = ref(false)
const collapsed = ref(false)

// 切换主题
const theme = ref('light')

const changeTheme = () => {
  document.documentElement.classList.remove('theme-light', 'theme-blue', 'theme-dark')
  if (theme.value === 'light') {
    document.documentElement.classList.add('theme-light')
  } else if (theme.value === 'blue') {
    document.documentElement.classList.add('theme-blue')
  } else if (theme.value === 'dark') {
    document.documentElement.classList.add('theme-dark')
  }
}

// 计算出来当前主题类
const themeClass = computed(() => {
  return `theme-${theme.value}`
})

// 暗黑模式切换
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// 更新时间
const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dateStr = now.toLocaleDateString()
  const timeStr = now.toLocaleTimeString()
  const dayStr = days[now.getDay()]
  currentTime.value = `${dateStr} ${timeStr} ${dayStr}`
}

let timer = null

// 加载用户信息
const userId = localStorage.getItem('id')

const loadUserInfo = async () => {
  if (!userId) {
    router.push('/login')
    return
  }

  try {
    const res = await api.getUserInfo(userId)
    if (!res || !res.id) {
      router.push('/login')
    }
  } catch (err) {
    console.error('获取用户信息失败', err)
    router.push('/login')
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  loadUserInfo()
  changeTheme() // 初始化应用主题
})

onUnmounted(() => {
  clearInterval(timer)
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const handleLogout = () => {
  // 1. 清空 localStorage
  localStorage.clear();

  // 2. 跳转回主菜单或登录页
  router.push('/login');  // 比如跳到首页'/'，如果你的登录页是'/login'就改成'/login'
};

const sidebarBgColor = computed(() => {
  if (theme.value === 'blue') {
    return '#d6ebff' // 更浅的蓝色
  } else if (theme.value === 'light') {
    return '#fffef0' // 更浅的淡黄色
  } else if (theme.value === 'dark' || isDarkMode.value) {
    return '#2a2a2a' // 深色保持稍浅一点
  }
  return '#ffffff' // 默认纯白
})



</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  transition: background-color 0.3s ease, color 0.3s ease; /* 动画平滑 */
}

.layout-container {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  height: 100%;
  border-right: 1px solid var(--el-border-color);
  transition: width 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
}

/* 主容器样式 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}


.sidebar-footer {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  padding: 0 20px;
  height: 60px;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 主内容区域 */
.main-content {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}

.router-view-container {
  flex: 1;
  overflow-y: auto;
}

/* 深色模式样式 */
.dark {
  --el-bg-color: #1f1f1f;
  --el-bg-color-page: #121212;
  --el-border-color: #434343;
  --el-text-color-primary: #e5e5e5;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 1000;
  }
  
  .main-content {
    margin-left: 0;
    padding: 10px;
  }
  
  .navbar {
    padding: 0 10px;
  }
}

/* 默认 Light 黄色风格 */
.theme-light {
  --el-bg-color: #fff8e1;
  --el-bg-color-page: #fffde7;
  --el-border-color: #f5e5b8;
  --el-text-color-primary: #333;
}

/* 蓝色主题 */
.theme-blue {
  --el-bg-color: #e3f2fd;
  --el-bg-color-page: #bbdefb;
  --el-border-color: #90caf9;
  --el-text-color-primary: #0d47a1;
}

/* 黑色主题 */
.theme-dark {
  --el-bg-color: #514e4e;
  --el-bg-color-page: #474343;
  --el-border-color: #585353;
  --el-text-color-primary: #e5e5e5;
}


/* 在这里可以添加额外的布局样式调整 */

</style>

<style>

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* 防止滚动条影响布局 */
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
