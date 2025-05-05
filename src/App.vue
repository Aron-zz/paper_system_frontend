<template>
  <!-- 根据当前路由显示不同布局 -->
  <div class="app-container" :class="{ 'login-layout': isLoginRoute }">
    <!-- 非登录页显示常规布局 -->
    <template v-if="!isLoginRoute">
      <el-container class="main-layout">
        <!-- 侧边栏、导航栏等原有结构 -->
        <router-view />
      </el-container>
    </template>
    
    <!-- 登录页显示专属布局 -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断当前是否是登录相关路由
const isLoginRoute = computed(() => {
  return route.path.startsWith('/login') || 
         route.path.startsWith('/register') || 
         route.path.startsWith('/reset-password')
})
</script>

<style>
/* 全局基础样式 */
body {
  margin: 0;
  font-family: "Helvetica Neue", Arial, sans-serif;
}


/* 登录界面专属背景 */
.login-layout {
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 主内容区域样式 */
.main-layout {
  height: 100vh;
}

/* 登录卡片样式（可放在全局或组件内） */
.login-card {
  width: 800px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-card {
    width: 90%;
    flex-direction: column;
  }
}
</style>