<template>
  <div class="auth-container">
    <div class="form-card">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="邮箱" required />
        <input v-model="password" type="password" placeholder="密码" required />
        <button type="submit">登录</button>
      </form>
      <p class="switch-mode">
        没有账号？
        <router-link to="/register">去注册</router-link><br />
        忘记密码？
        <router-link to="/reset-password">修改密码</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 在需要使用的文件中
import api from '../api/index.js';

import { useRouter } from 'vue-router';
const router = useRouter();

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // 调用 api 对象的 login 方法
    const response = await api.login(email.value, password.value);

    // 2. 登录成功处理
    console.log('登录响应数据:', response); // 调试用
    const id = response.id;

    // 存储 token（用于后续认证）
    localStorage.setItem('id', id);

    // 提示并跳转
    alert('登录成功');
    router.push('/home/user-profile');

  } catch (err) {
    // 3. 错误处理（细化不同错误场景）
    let errorMessage = '登录失败';

    if (err.response) {
      // 请求已发出，但服务器返回了错误状态码（如 4xx/5xx）
      const { status, data } = err.response;

      switch (status) {
        case 400:
          errorMessage = data.message || '请求参数错误';
          break;
        case 401:
          errorMessage = data.message || '邮箱或密码错误';
          break;
        case 403:
          errorMessage = data.message || '无访问权限';
          break;
        case 404:
          errorMessage = '接口不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = data.message || `未知错误（${status}）`;
      }

    } else if (err.request) {
      // 请求已发出，但未收到响应（如网络断开）
      errorMessage = '网络错误，请检查连接';

    } else {
      // 其他错误（如代码异常）
      errorMessage = err.message || '登录请求发送失败';
    }

    // 显示错误提示
    alert(errorMessage);
    console.error('登录错误详情:', err); // 打印完整错误日志
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}

.form-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 320px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input {
  display: block;
  width: 100%;
  padding: 0.6rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

button {
  width: 100%;
  padding: 0.6rem;
  background-color: #42b983;
  border: none;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: #36986e;
}

.switch-mode {
  margin-top: 1rem;
  text-align: center;
}
</style>