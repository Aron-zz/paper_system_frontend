<template>
  <div :class="[{ dark: isDarkMode }, 'navbar']">
    <span class="time-info">{{ currentTime }}</span>
    <span class="user-info">你好!</span>
    <button @click="logout">退出</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 定义 props
const props = defineProps({
  currentTime: String,
  isDarkMode: Boolean
})

// 退出登录
const logout = () => {
  // 清除本地存储中的用户 ID
  localStorage.removeItem('id')

  // 跳转到登录页面
  router.push('/login')
}

// 控制菜单显示/隐藏
const toggleMenu = () => {
  console.log('Menu toggled')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff; /* 默认背景色 */
  color: #333; /* 默认文本颜色 */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar .time-info, .navbar .user-info {
  margin-right: 20px;
}

.navbar .time-info {
  flex-grow: 1;
  text-align: left;
}

.navbar .user-info {
  flex-shrink: 0;
}

.navbar button {
  margin-left: 20px;
  background-color: #4caf50; /* 浅色模式下按钮的绿色背景 */
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px; /* 添加圆角 */
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

/* 浅色模式下按钮的悬停效果 */
.navbar button:hover {
  background-color: #45a049;  /* 浅色模式下按钮的悬停背景色 */
  transform: scale(1.05); /* 鼠标悬停时按钮放大 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加悬停阴影效果 */
}

.navbar button:active {
  transform: scale(1.03); /* 按钮被点击时缩小 */
}

/* 深色主题样式 */
.navbar.dark {
  background-color: #444; /* 深色背景 */
  color: white; /* 白色文字 */
}

.navbar.dark button {
  background-color: #666; /* 深色模式下按钮的背景颜色 */
}

.navbar.dark button:hover {
  background-color: #4caf50; /* 深色模式下按钮的 hover 背景颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* 深色模式下的阴影效果 */
  transform: scale(1.05); /* 深色模式下按钮悬停时的放大效果 */
}

.navbar.dark button:active {
  transform: scale(1.03); /* 按钮被点击时缩小 */
}
</style>

