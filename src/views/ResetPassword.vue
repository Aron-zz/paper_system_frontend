<template>
  <div class="auth-container">
    <el-card class="form-card">
      <h2>找回密码</h2>
      <el-form @submit.prevent="handleReset">
        <el-form-item>
          <el-input v-model="form.email" placeholder="邮箱" type="email" required></el-input>
        </el-form-item>

        <el-form-item>
          <el-row>
            <el-col :span="16">
              <el-input v-model="form.code" placeholder="验证码" required></el-input>
            </el-col>
            <el-col :span="8">
              <el-button
                :disabled="countdown > 0"
                @click="sendCode"
                type="primary"
                size="small">
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.newPassword" placeholder="新密码" type="password" required></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="form.confirmPassword" placeholder="确认新密码" type="password" required></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" block>提交</el-button>
        </el-form-item>
      </el-form>

      <p class="switch-mode">
        取消修改？<router-link to="/login">返回登录</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'
import axios from 'axios'

const router = useRouter()

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
    const response = await api.resetPassword(form.email, form.newPassword)
    console.log('修改密码响应数据:', response) // 调试用
    alert('密码重置成功，请重新登录')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.message || '重置失败')
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

.el-input,
.el-button {
  width: 100%;
  margin: 0.5rem 0;
  height: 70%;
}

.switch-mode {
  margin-top: 1rem;
  text-align: center;
}
</style>
