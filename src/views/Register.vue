<template>
  <div class="auth-container">
    <el-card class="form-card">
      <h2>用户注册</h2>
      <el-form @submit.prevent="handleRegister" label-position="top" :model="form" status-icon>
        <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
          <el-input v-model="form.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="邮箱验证码" :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
          <el-row gutter="10">
            <el-col :span="15">
              <el-input v-model="form.code" placeholder="请输入邮箱验证码" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" :disabled="countdown > 0" @click="sendCode">
                {{ countdown > 0 ? `${countdown}s后重发` : '发送验证码' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="再次输入密码" :rules="[{ required: true, message: '请确认密码', trigger: 'blur' }]">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" />
        </el-form-item>

        <el-form-item>
          <div class="button-container">
              <el-button type="primary" native-type="submit" block>注册</el-button>
          </div>
        </el-form-item>
      </el-form>

      <p class="switch-mode">
        已有账号？<router-link to="/login">去登录</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

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

const now = new Date().toISOString()

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
    })

    console.log('注册成功，返回内容:', res.data)

    localStorage.setItem('id', res.id)

    alert('注册成功！')
    router.push('/complete-profile')
  } catch (err) {
    console.error('注册失败详细信息：', err.response?.data || err)
    alert(err.response?.data || '注册失败')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: #f3f4f6 url('src/assets/1.jpg') no-repeat center/cover;
  padding: 20px; /* 安全边距 */
}

.form-card {
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  margin: 0 auto;
}

.switch-mode {
  margin-top: 1rem;
  text-align: center;
}

.button-container {
  text-align: center;  /* 使按钮居中 */
  width: 100%;
}
</style>
