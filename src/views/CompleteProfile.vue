<template>
  <div class="auth-container">
    <div class="form-card">
      <h2 style="text-align: center; margin-bottom: 1rem;">完善个人信息(选填)</h2>
      <form @submit.prevent="submitProfile">
        <label>头像上传：</label>
        <input type="file" @change="handleAvatarUpload" />

        <label>联系方式：</label>
        <input type="text" v-model="form.contact" placeholder="请输入手机号或邮箱" />

        <label>生日：</label>
        <input type="date" v-model="form.birthday" />

        <label>性别：</label>
        <select v-model="form.gender">
          <option value="">请选择</option>
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="保密">保密</option>
        </select>

        <label>所属单位：</label>
        <input type="text" v-model="form.organization" placeholder="例如：xx大学 xx公司" />

        <button type="submit">提交信息</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 在需要使用的文件中
import api from '../api/index.js';

// 路由实例
const router = useRouter()

// 表单数据
const form = ref({
  contact: '',
  birthday: '',
  gender: '',
  organization: '',
  avatar: null,
})


// 当前登录用户 ID（你可以从本地缓存、全局状态、pinia等获取）
const currentUserId = localStorage.getItem('id');

// 监听头像选择
const handleAvatarUpload = (e) => {
  form.value.avatar = e.target.files[0]
}

// 上传头像，返回头像 URL（必须有后端接口支持 /api/user/upload-avatar）
const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const res = await fetch('/api/user/upload-avatar', {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('头像上传失败')
  const data = await res.json()
  return data.url // 后端返回的头像 URL
}

// 提交资料
const submitProfile = async () => {
  try {
    let avatarUrl = ''

    // 有头像就先上传
    if (form.value.avatar) {
      avatarUrl = await uploadAvatar(form.value.avatar)
    }

    // 构造 JSON 数据
    const profileData = {
      id: currentUserId,
      contact: form.value.contact || '未填写',
      birthday: form.value.birthday || '2000-01-01',
      gender: form.value.gender || '保密',
      organization: form.value.organization || '未知单位',
      avatarUrl: avatarUrl
    }

    // 提交 JSON 数据

     const res = await api.completeProfile(profileData);

    alert('信息提交成功！')
    router.push('/home/user-profile')
  } catch (err) {
    alert(err.message || '提交失败，请重试')
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

input,
select {
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
</style>
