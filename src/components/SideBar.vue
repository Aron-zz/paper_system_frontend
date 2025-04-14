<template>
  <div :class="{ dark: isDarkMode, collapsed: collapsed }" class="sidebar">
    <ul>
      <li @click="goTo('user-profile')">个人主页</li>
      <li @click="goTo('contact-management')">联系人管理</li>
      <li @click="goTo('article-management')">文章管理</li>
    </ul>
    <ThemeToggle @toggle="toggleTheme" />
    <button @click="toggleSidebar">切换侧边栏</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()

const props = defineProps({
  isDarkMode: Boolean,
  collapsed: Boolean,  // 接收父组件传递的折叠状态
})

const emit = defineEmits(['toggle-theme', 'toggle-sidebar'])

const goTo = (page) => {
  router.push({ path: `/home/${page}` })
  console.log(`Navigating to ${page}`)
}

const toggleTheme = () => {
  emit('toggle-theme')
}

const toggleSidebar = () => {
  emit('toggle-sidebar')  // 发出切换折叠状态的事件
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  width: 250px;
  height: 100%;
  background-color: #f4f4f4;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width 0.3s ease;
}

/* 深色模式下侧边栏背景 */
.sidebar.dark {
  background-color: #444;
}

/* 菜单项样式 */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 20px 0;
  cursor: pointer;
  color: #333;  /* 浅色模式下的文字颜色 */
  transition: color 0.3s ease;
}

li:hover {
  color: #4caf50;  /* 鼠标悬停时的绿色 */
}

/* 深色模式下的菜单项文字颜色 */
.sidebar.dark li {
  color: #ddd;  /* 深色模式下的文字颜色 */
}

.sidebar.dark li:hover {
  color: #4caf50;  /* 深色模式下鼠标悬停的绿色 */
}

/* 侧边栏折叠时的样式 */
.sidebar.collapsed {
  width: 80px;  /* 折叠时宽度 */
}

.sidebar.collapsed ul {
  display: none; /* 折叠时隐藏菜单项 */
}

/* 主题切换按钮样式 */
.theme-toggle {
  margin-top: 20px;
}

/* 按钮样式 */
button {
  margin-top: 20px;
  background-color: #4caf50;  /* 浅色模式下按钮的绿色背景 */
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s, box-shadow 0.3s ease;
}

/* 浅色模式下按钮的悬停效果 */
button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  /* 添加悬停阴影效果 */
  background-color: #45a049;  /* 修改背景颜色 */
}

button:active {
  transform: scale(1.03);
}

/* 深色模式下按钮颜色 */
.sidebar.dark button {
  background-color: #666;  /* 深色模式下按钮的背景颜色 */
}

.sidebar.dark button:hover {
  background-color: #777;  /* 深色模式下按钮的 hover 背景颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);  /* 深色模式下的阴影效果 */
}

/* 切换侧边栏按钮样式 */
button.toggle-sidebar {
  background-color: #f44336;  /* 浅色模式下按钮的背景颜色 */
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease, transform 0.2s, box-shadow 0.3s ease;
}

/* 切换侧边栏按钮的悬停效果 */
button.toggle-sidebar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  /* 添加悬停阴影效果 */
  background-color: #f44336;  /* 浅色模式下按钮的悬停背景色 */
}

button.toggle-sidebar:active {
  transform: scale(1.03);
}

/* 深色模式下切换侧边栏按钮 */
.sidebar.dark button.toggle-sidebar {
  background-color: #666;  /* 深色模式下按钮的背景颜色 */
}

.sidebar.dark button.toggle-sidebar:hover {
  background-color: #777;  /* 深色模式下按钮的 hover 背景颜色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);  /* 深色模式下的阴影效果 */
}
</style>



