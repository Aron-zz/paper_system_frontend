<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        <img :src="avatarUrl" alt="User Avatar" />
        <input type="file" id="file-upload" @change="handleAvatarChange" accept="image/*" />
        <button @click="triggerFileInput">上传头像</button>
      </div>
      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p>{{ user.email }}</p>
        <p>{{ user.gender }}</p>
        <p>{{ user.birthday }}</p>
        <p>{{ user.organization }}</p>
      </div>
    </div>

    <div class="profile-edit">
      <h3>Edit Profile</h3>
      <form @submit.prevent="handleSubmit">
        <label for="username">姓名:</label>
        <input v-model="user.username" type="text" id="username" />

        <label for="email">邮箱:</label>
        <input v-model="user.email" type="email" id="email" />

        <label for="gender">性别:</label>
        <select v-model="user.gender">
          <option value="男">男</option>
          <option value="女">女</option>
          <option value="保密">保密</option>
        </select>

        <label for="birthday">生日:</label>
        <input v-model="user.birthday" type="date" id="birthday" />

        <label for="organization">组织:</label>
        <input v-model="user.organization" type="text" id="organization" />

        <button type="submit">保存更改</button>
      </form>
    </div>

    <!-- 日历部分 -->
    <div class="calendar-section">
      <vue-cal
        v-model="calendarDate"
        :events="events"
        :disable-views="['year', 'month']"
        :event-color="event => event.color || '#4caf50'"
        :event-text-color="event => event.textColor || '#fff'"
        :on-event-click="onEventClick"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import VueCal from 'vue-cal';  // 引入 vue-cal 组件
import 'vue-cal/dist/vuecal.css';  // 引入样式
import api from '../../api/index.js'
import { useRoute } from 'vue-router'

const user = ref({
  id: null,
  username: '',
  email: '',
  gender: '',
  birthday: '',
  organization: '',
  avatarUrl: '' //加上这一项确保能更新
})

const avatarUrl = ref('/default-avatar.png')
const selectedFile = ref(null)

const route = useRoute()
const userId = route.query.userId || localStorage.getItem('id')

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const res = await api.getUserInfo(userId)
     console.log('返回的用户信息：', res)

     // 确保接收到的字段名称是正确的
     user.value = res
     avatarUrl.value = res.avatarUrl || '/default-avatar.png' // 这里使用 avatarUrl 来绑定
  } catch (err) {
    console.error('获取用户信息失败', err)
  }
}

// 触发文件选择
const triggerFileInput = () => {
  document.getElementById('file-upload').click()
}

// 处理头像变更
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      avatarUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 提交更新
const handleSubmit = async () => {
  try {

    // 如果选择了新头像，先上传头像
    if (selectedFile.value) {
      const res = await api.uploadAvatar(selectedFile.value, user.value.id)

      console.log('返回的头像信息'+res)
      // 设置返回的头像 URL 到 user.value.avatar 中
      user.value.avatarUrl = res || ''
    }

    // 更新用户信息（包括 avatar 字段）
    await api.updateUserInfo(user.value)
    alert('更新成功')
  } catch (err) {
    console.error('更新失败：', err)
    alert(err.response?.data?.message || '更新失败')
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>


<style scoped>
.user-profile {
  display: flex;
  gap: 40px;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #fff;
  color: #333;
}

/* 整体暗色背景与字体 */
.dark-theme .user-profile {
  background-color: #222;
  color: #eee;
}

/* 左侧整体 */
.left-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark-theme .left-section {
  background-color: #333;
  color: #eee;
}

/* 头像区 */
.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

/* 上传按钮 */
.upload-label {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #45a049;
}

/* 暗主题下按钮变灰 */
.dark-theme .upload-label {
  background-color: #666;
  color: white;
}

.dark-theme .upload-label:hover {
  background-color: #4caf50;
}

/* 隐藏 input 文件名展示 */
input[type="file"] {
  display: none;
}

/* 用户信息 */
.user-info {
  margin-top: auto;
}

.user-info p {
  margin: 6px 0;
  font-size: 16px;
  color: #333;
}

.dark-theme .user-info p {
  color: #eee;
}

/* 修改表单右侧更大 */
.profile-edit {
  flex: 2.5; /* 调整宽度更大一些 */
  background-color: #fafafa;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: fit-content;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark-theme .profile-edit {
  background-color: #444;
  color: #eee;
}

.profile-edit form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-edit label {
  font-size: 16px;
  font-weight: 500;
  color: inherit;
}

.profile-edit input,
.profile-edit select {
  padding: 12px;
  margin-top: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  width: 100%;
}

.dark-theme .profile-edit input,
.dark-theme .profile-edit select {
  background-color: #555;
  color: white;
  border-color: #666;
}

.profile-edit input:focus,
.profile-edit select:focus {
  border-color: #4caf50;
  background-color: #f9f9f9;
  outline: none;
}

.dark-theme .profile-edit input:focus,
.dark-theme .profile-edit select:focus {
  background-color: #444;
}

/* 按钮 */
.profile-edit button {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  width: 100%;
}

.profile-edit button:hover {
  background-color: #45a049;
}

.profile-edit button:focus {
  outline: none;
  background-color: #388e3c;
}

.dark-theme .profile-edit button {
  background-color: #666;
}

.dark-theme .profile-edit button:hover {
  background-color: #4caf50;
}

/* 滚动条样式 */
.user-profile::-webkit-scrollbar {
  width: 10px;
}

.user-profile::-webkit-scrollbar-thumb {
  background-color: #4caf50;
  border-radius: 10px;
}

.user-profile::-webkit-scrollbar-track {
  background-color: #e0e0e0;
}

.dark-theme .user-profile::-webkit-scrollbar-thumb {
  background-color: #666;
}

.dark-theme .user-profile::-webkit-scrollbar-track {
  background-color: #333;
}

/* 响应式 */
@media (max-width: 768px) {
  .user-profile {
    flex-direction: column;
  }

  .left-section,
  .profile-edit {
    width: 100%;
  }

  .avatar {
    justify-content: center;
  }
}

/* 上传按钮 */
.upload-label {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background-color: #45a049;
}

/* 暗主题下按钮颜色 */
.dark-theme .upload-label {
  background-color: #666;
  color: white;
}

.dark-theme .upload-label:hover {
  background-color: #4caf50;
}

.calendar-section {
  margin-top: 20px;
  width: 100%;
  border-radius: 12px; /* 与其他部分统一圆角 */
  background-color: #fafafa; /* 背景色与右侧编辑部分统一 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 统一阴影 */
  height: 100%; /* 确保容器的高度充满可用空间 */
  min-height: 500px; /* 设置更大的最小高度，确保日历能完全显示 */
  padding: 20px; /* 内间距 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 暗主题下的日历部分 */
.dark-theme .calendar-section {
  background-color: #444; /* 背景色变暗 */
  color: #eee; /* 字体颜色变亮 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影更深 */
}

/* 日历的自适应设置 */
.vue-cal {
  width: 100%; /* 确保日历宽度填充父容器 */
  height: 100%; /* 高度自适应 */
  min-height: 500px; /* 确保日历至少有 500px 高，防止 week 显示不全 */
}

/* 针对小屏幕的自适应 */
@media (max-width: 768px) {
  .calendar-section {
    min-height: 400px; /* 确保在小屏幕时日历不会过大 */
  }
}

</style>




