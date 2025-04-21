<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <h2 class="auth-title">登录</h2>

      <div class="auth-body">
        <!-- 左边：第三方登录 -->
        <div class="third-party-login">
          <el-button type="primary" icon="el-icon-user-solid" class="third-party-btn" @click="loginWith('qq')">
            QQ登录
          </el-button>
          <el-button type="success" icon="el-icon-chat-dot-square" class="third-party-btn" @click="loginWith('wechat')">
            微信登录
          </el-button>
          <el-button type="info" icon="el-icon-wallet" class="third-party-btn" @click="loginWith('alipay')">
            支付宝登录
          </el-button>
        </div>


        <!-- 右边：邮箱密码登录 -->
        <div class="divider"></div>

        <div class="user-login">
          <el-input v-model="email" placeholder="请输入邮箱" class="input-box" />
          <el-input v-model="password" placeholder="请输入密码" class="input-box" show-password />
          <el-button type="success" class="login-submit" @click="handleLogin">登录</el-button>
        </div>
      </div>

      <!-- 底部：注册和修改密码 -->
      <div class="auth-footer">
        <el-button class="footer-btn" @click="router.push('/register')">注册用户</el-button>
        <el-button class="footer-btn" @click="router.push('/reset-password')">修改密码</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '../api/index.js'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const response = await api.login(email.value, password.value)
    const id = response.id
    localStorage.setItem('id', id)
    ElMessage.success('登录成功')
    router.push('/home/user-profile')
  } catch (err) {
    let errorMessage = '登录失败'
    if (err.response) {
      const { status, data } = err.response
      switch (status) {
        case 400:
          errorMessage = data.message || '请求参数错误'
          break
        case 401:
          errorMessage = data.message || '邮箱或密码错误'
          break
        case 403:
          errorMessage = data.message || '无访问权限'
          break
        case 404:
          errorMessage = '接口不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        default:
          errorMessage = data.message || `未知错误（${status}）`
      }
    } else if (err.request) {
      errorMessage = '网络错误，请检查连接'
    } else {
      errorMessage = err.message || '登录请求发送失败'
    }
    ElMessage.error(errorMessage)
  }
}

const loginWith = (platform) => {
  ElMessage.info(`即将跳转${platform}登录...`)
  console.log(`跳转到 ${platform} 登录`)
}
</script>

<style scoped>
.auth-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('src/assets/1.jpg'); 
  background-size: cover;
}

.auth-card {
  width: 800px;
  padding: 30px 50px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7); /* 半透明白色 */
  backdrop-filter: blur(10px);           /* 毛玻璃模糊效果 */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* 微光影 */
}

.auth-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
}

.auth-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.third-party-login {
  display: flex;
  flex-direction: column;  /* 垂直排列 */
  gap: 20px;               /* 按钮间距 */
  width: 50%;
  align-items: center;     /* 确保按钮在水平方向上居中对齐 */
}


.third-party-btn {
  width: 200px;      /* 按钮宽度 */
  height: 40px;      /* 按钮高度 */
  font-size: 16px;   /* 字体大小 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;  /* 去除按钮的外边距 */
}


.divider {
  width: 1px;
  height: 200px;
  background: #ccc;
  margin: 0 20px;
}

.user-login {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 50%;
}

.input-box {
  width: 100%;
  height: 40px;
}

.login-submit {
  width: 100%;
  height: 40px;
}

.auth-footer {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.footer-btn {
  flex: 1;
  width: 200px;      /* 按钮宽度 */
  height: 45px;      /* 按钮高度 */
  font-size: 16px;   /* 字体大小 */
}


@media (max-width: 768px) {
  .auth-body {
    flex-direction: column; /* 切换为竖直排列 */
    align-items: center; /* 居中排列 */
  }

  .third-party-login {
    width: 100%;
    gap: 15px; /* 按钮之间的间距减少 */
  }

  .user-login {
    width: 50%;
    gap: 10px;
  }
  
  .footer-btn {
  flex: 1;
  width: 100px;     /* 按钮宽度 */
  height: 35px;     /* 按钮高度 */
  font-size: 16px;  /* 字体大小 */
  display: flex;
  justify-content: center;  /* 使文本居中 */
  align-items: center;      /* 垂直居中 */
}

.auth-footer {
  margin-top: 30px;
  width: 100%;              /* 宽度设置为80% */
  display: flex;           /* 使用flex布局 */
  flex-direction: column;  /* 垂直排列元素 */
  justify-content: center; /* 在垂直方向上居中 */
  align-items: center;     /* 在水平方向上居中 */
  gap: 10px;               /* 元素之间的间距 */
}

  .divider {
    display: block; /* 显示分隔线 */
    width: 80%; /* 设置分隔线宽度 */
    height: 1px; /* 设置高度为1px，呈现细线效果 */
    background-color: #ccc; /* 设置分隔线颜色 */
    margin: 20px 0; /* 上下有一定间隔 */
  }
}

</style>

