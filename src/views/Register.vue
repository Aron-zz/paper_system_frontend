<template>
  <div class="auth-container">
    <div class="form-card">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="form.username" placeholder="用户名" required />
        <input v-model="form.email" type="email" placeholder="邮箱" required />
        <div class="email-code-row">
          <input v-model="form.code" placeholder="邮箱验证码" required />
          <button type="button" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
          </button>
        </div>
        <input v-model="form.password" type="password" placeholder="密码" required />
        <input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" required />
        <button type="submit">注册</button>
      </form>
      <p class="switch-mode">
        已有账号？<router-link to="/login">去登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router';
const router = useRouter();

// 在需要使用的文件中
import api from '../api/index.js';


const form = reactive({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const countdown = ref(0)
let timer = null

const sendCode = async () => {
  if (!form.email) return alert('请输入邮箱')
  try {
    await axios.post('/api/send-code', { email: form.email, type: 'register' })
    alert('验证码已发送，请查收邮箱')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err) {
    alert('验证码发送失败')
  }
}

const now = new Date().toISOString(); // 标准格式："2025-04-04T12:00:00.000Z"

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  try {
    const res = await api.register({
      username: form.username,
      email: form.email,
      password: form.password,
      createdAt: now,
    });

    // 打印返回的用户信息，检查是否包含 id
    console.log('注册成功，返回内容:', res.data);

    // 存储返回的 user.id 到 localStorage
    console.log('用户id:', res.id);
    localStorage.setItem('id', res.id);

    alert('注册成功！');
    router.push('/complete-profile');
  } catch (err) {
    console.error('注册失败详细信息：', err.response?.data || err);
    alert(err.response?.data || '注册失败');
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
