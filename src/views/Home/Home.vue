<template>
  <div :class="{ dark: isDarkMode }" class="home">
    <!-- 侧边栏 -->
    <Sidebar
      :isDarkMode="isDarkMode"
      @toggle-theme="toggleTheme"
      @toggle-sidebar="toggleSidebar"
      :collapsed="collapsed"
    />

    <div class="main-content">
      <!-- 导航栏 -->
      <Navbar :currentTime="currentTime" :isDarkMode="isDarkMode" />

      <div class="content">
        <!-- 显示路由内容 -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '../../components/SideBar.vue'
import Navbar from '../../components/NavBar.vue'
import api from '../../api/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const isDarkMode = ref(false)
const collapsed = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-theme', isDarkMode.value)
}

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
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

// 加载用户信息并验证 ID
const userId = localStorage.getItem('id')

const loadUserInfo = async () => {
  if (!userId) {
    // 如果没有本地存储的 ID，直接跳转到登录页
    router.push('/login')
    return
  }

  try {
    const res = await api.getUserInfo(userId)
    if (!res || !res.id) {
      // 如果后端返回无效的用户信息，跳转到登录页
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
  loadUserInfo() // 加载用户信息并验证 ID
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>


<style scoped>
.home {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 250px; /* 侧边栏宽度 */
  height: 100%;
  background-color: #f4f4f4;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.3s ease;
  z-index: 100; /* 确保侧边栏在内容上方 */
}

.sidebar.collapsed {
  width: 80px; /* 侧边栏折叠时的宽度 */
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px; /* 默认留出侧边栏的空间 */
  transition: margin-left 0.3s ease; /* 平滑过渡 */
  padding: 20px;
  overflow-y: auto;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  overflow: hidden; /* 禁止页面整体滚动 */
}

/* 深色主题 */
.dark-theme {
  background-color: #333;
  color: white;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 当侧边栏折叠时，调整主内容区域的 margin-left */
.main-content.collapsed {
  margin-left: 80px; /* 折叠时侧边栏的宽度 */
}

/* 自适应屏幕大小的调整 */
@media (max-width: 1200px) {
  .sidebar {
    width: 200px; /* 中等屏幕时侧边栏宽度 */
  }

  .main-content {
    margin-left: 200px; /* 中等屏幕时调整主内容区域宽度 */
  }

  .main-content.collapsed {
    margin-left: 80px; /* 折叠时的宽度 */
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 180px; /* 更小屏幕时侧边栏宽度 */
  }

  .main-content {
    margin-left: 180px; /* 更小屏幕时调整主内容区域宽度 */
  }

  .main-content.collapsed {
    margin-left: 60px; /* 折叠时的宽度 */
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 160px; /* 小屏幕时侧边栏宽度 */
  }

  .main-content {
    margin-left: 160px; /* 小屏幕时调整主内容区域宽度 */
  }

  .main-content.collapsed {
    margin-left: 60px; /* 折叠时的宽度 */
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 120px; /* 超小屏幕时侧边栏宽度 */
  }

  .main-content {
    margin-left: 120px; /* 超小屏幕时调整主内容区域宽度 */
  }

  .main-content.collapsed {
    margin-left: 50px; /* 折叠时的宽度 */
  }
}

</style>

