<template>
  <div class="auth-container">
    <div class="form-card">
      <h2>找回密码</h2>
      <form @submit.prevent="handleReset">
        <input v-model="form.email" type="email" placeholder="邮箱" required />
        <div class="email-code-row">
          <input v-model="form.code" placeholder="验证码" required />
          <button type="button" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
          </button>
        </div>
        <input v-model="form.newPassword" type="password" placeholder="新密码" required />
        <input v-model="form.confirmPassword" type="password" placeholder="确认新密码" required />
        <button type="submit">提交</button>
      </form>
      <p class="switch-mode">
        取消修改？<router-link to="/login">返回登录</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

import { useRouter } from 'vue-router';
const router = useRouter();

// 在需要使用的文件中
import api from '../api/index.js';

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const countdown = ref(0)
let timer = null

const sendCode = async () => {
  if (!form.email) return alert('请输入邮箱')
  try {
    await axios.post('/api/send-code', { email: form.email, type: 'reset' })
    alert('验证码发送成功')
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (err) {
    alert('验证码发送失败')
  }
}

const handleReset = async () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('两次密码不一致')
    return
  }
   try {
       // 调用 API 中的重置密码接口
       const response = await api.resetPassword(form.email, form.newPassword);
       console.log('修改密码响应数据:', response); // 调试用
       alert('密码重置成功，请重新登录');
       router.push('/login');
     } catch (err) {
       alert(err.response?.data?.message || '重置失败');
     }
}
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