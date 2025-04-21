<template>
  <div class="user-profile-container">
    <el-page-header @back="goBack" title="返回">
      <template #content>
        <span class="page-header-title">个人中心</span>
      </template>
    </el-page-header>

    <div class="profile-content">
      <!-- 左侧信息展示区 -->
      <el-card class="profile-card">
        <div class="avatar-section">
          <el-avatar :size="120" :src="displayAvatarUrl" />
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
            :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary" size="small">
              <el-icon><Upload /></el-icon>更换头像
            </el-button>
          </el-upload>
        </div>

        <div class="user-info">
          <h3>{{ user.username }}</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="邮箱">{{ user.email || '未设置' }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ user.gender || '未设置' }}</el-descriptions-item>
            <el-descriptions-item label="生日">{{ user.birthday || '未设置' }}</el-descriptions-item>
            <el-descriptions-item label="组织">{{ user.organization || '未设置' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>

      <!-- 右侧编辑区 -->
      <el-card class="edit-form-card">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="日历" name="other">
            <div class="calendar-section">
              <el-calendar v-model="calendarDate" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="基本信息" name="basic">
            <el-form :model="user" label-width="80px" label-position="top">
              <el-form-item label="姓名" required>
                <el-input v-model="user.username" placeholder="请输入姓名" />
              </el-form-item>
              <el-form-item label="邮箱" required>
                <el-input v-model="user.email" placeholder="请输入邮箱" type="email" />
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="user.gender" placeholder="请选择性别">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                  <el-option label="保密" value="保密" />
                </el-select>
              </el-form-item>
              <el-form-item label="生日">
                <el-date-picker
                  v-model="user.birthday"
                  type="date"
                  placeholder="选择生日"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              <el-form-item label="组织">
                <el-input v-model="user.organization" placeholder="请输入组织名称" />
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="handleSubmit"
                  :loading="isSubmitting"
                  :disabled="!formValid"
                >
                  {{ isSubmitting ? '保存中...' : '保存修改' }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import api from '../../api/index.js'

const router = useRouter()

// 响应式数据
const user = ref({
  id: null,
  username: '',
  email: '',
  gender: '',
  birthday: '',
  organization: '',
  avatarUrl: ''
})

const activeTab = ref('basic')
const calendarDate = ref(new Date())
const selectedFile = ref(null)
const isSubmitting = ref(false)

// 计算属性
const displayAvatarUrl = computed(() => {
  return user.value.avatarUrl || '/default-avatar.png'
})

const formValid = computed(() => {
  return user.value.username && user.value.email
})

// 方法
const loadUserInfo = async () => {
  try {
    const userId = localStorage.getItem('id')
    if (!userId) {
      router.push('/login')
      return
    }

    const res = await api.getUserInfo(userId)
    user.value = { ...res, id: userId }
  } catch (err) {
    console.error('获取用户信息失败:', err)
    ElMessage.error('获取用户信息失败')
  }
}

const beforeAvatarUpload = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!validTypes.includes(file.type)) {
    ElMessage.error('请上传 JPG/PNG/WEBP 格式图片!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('头像大小不能超过 5MB!')
    return false
  }
  return true
}

// 严格使用您定义的接口
const handleAvatarChange = (file) => {
  if (!file || !file.raw) return
  if (!beforeAvatarUpload(file.raw)) return

  selectedFile.value = file.raw
  user.value.avatarUrl = URL.createObjectURL(file.raw)
}

// 完全按照您提供的接口规范实现
const handleSubmit = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在保存数据...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  isSubmitting.value = true

  try {
    // 1. 上传头像（完全使用您定义的接口）
    if (selectedFile.value) {
      const res = await api.uploadAvatar(selectedFile.value, user.value.id)
      user.value.avatarUrl = res.data || res // 直接使用接口返回数据
    }

    // 2. 更新用户信息
    await api.updateUserInfo(user.value)
    ElMessage.success('个人信息更新成功')
    
  } catch (err) {
    console.error('保存失败:', err)
    ElMessage.error(err.response?.data?.message || '保存失败，请重试')
  } finally {
    loading.close()
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.user-profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header-title {
  font-size: 18px;
  font-weight: bold;
}

.profile-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.profile-card {
  width: 300px;
  flex-shrink: 0;
}

.edit-form-card {
  flex: 1;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-uploader {
  margin-top: 10px;
  text-align: center;
}

.user-info {
  margin-top: 20px;
}

.user-info h3 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
}

.calendar-section {
  height: 500px;
}

.el-form {
  padding: 10px;
}

.el-form-item {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }
  
  .profile-card {
    width: 100%;
  }
}
</style>