<template>
  <div class="auth-container">
    <el-card class="form-card">
      <h2 class="title">完善个人信息(选填)</h2>

      <el-form @submit.prevent="submitProfile" label-position="top">
        <el-form-item label="头像上传：">
          <div class="avatar-uploader-wrapper">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatarPreview" :src="avatarPreview" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="联系方式：">
          <el-input v-model="form.contact" placeholder="请输入手机号或邮箱" size="large" class="form-input" />
        </el-form-item>

        <el-form-item label="生日：">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择生日"
            size="large"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="性别：">
          <el-select v-model="form.gender" placeholder="请选择性别" size="large" class="form-input">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="保密" value="保密" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属单位：">
          <el-input v-model="form.organization" placeholder="例如：xx大学 xx公司" size="large" class="form-input" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" class="submit-button" @click="submitProfile">提交信息</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 导入 API
import api from '../api/index.js'

const router = useRouter()

// 表单数据
const form = ref({
  contact: '',
  birthday: '',
  gender: '',
  organization: '',
  avatar: null,
})

const avatarPreview = ref('')

// 当前登录用户 ID
const currentUserId = localStorage.getItem('id')

// 上传前处理
const beforeAvatarUpload = (file) => {
  form.value.avatar = file
  const reader = new FileReader()
  reader.onload = () => {
    avatarPreview.value = reader.result
  }
  reader.readAsDataURL(file)
  return false // 阻止 ElementPlus 自动上传
}

// 上传头像
const uploadAvatar = async (file) => {
  try {
    const res = await api.uploadAvatar(file, currentUserId)
    return res.avatarUrl
  } catch (err) {
    ElMessage.error('头像上传失败')
    throw err
  }
}

// 提交表单
const submitProfile = async () => {
  try {
    let avatarUrl = ''
    if (form.value.avatar) {
      avatarUrl = await uploadAvatar(form.value.avatar)
    }

    const profileData = {
      id: currentUserId,
      contact: form.value.contact || '未填写',
      birthday: form.value.birthday || '2000-01-01',
      gender: form.value.gender || '保密',
      organization: form.value.organization || '未知单位',
      avatarUrl
    }

    await api.completeProfile(profileData)

    ElMessage.success('信息提交成功！')
    router.push('/home/user-profile')
  } catch (err) {
    ElMessage.error(err.message || '提交失败，请重试')
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
  padding: 2rem;
  border-radius: 1rem;
  width: 320px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.avatar-uploader-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.avatar-uploader .el-icon {
  font-size: 32px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.button-container {
  text-align: center;
  width: 100%;
}

.el-form-item {
  margin-bottom: 1.2rem; /* 每个表单项之间间隔统一一点 */
}

.el-input,
.el-select,
.el-date-picker {
  width: 100%;
}

.el-button {
  width: 100%;
  height: 36px; /* 设置按钮高度 */
  padding: 0;  /* 移除内边距 */
  line-height: 36px; /* 设置文本垂直居中 */
}

</style>


