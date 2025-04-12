<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        <img :src="avatarUrl" alt="User Avatar" />
        <input type="file" @change="handleAvatarChange" />
      </div>
      <div class="user-info">
        <h2>{{ user.name }}</h2>
        <p>{{ user.email }}</p>
        <p>{{ user.gender }}</p>
        <p>{{ user.birthday }}</p>
        <p>{{ user.college }}</p>
      </div>
    </div>

    <div class="profile-edit">
      <h3>Edit Profile</h3>
      <form @submit.prevent="handleSubmit">
        <label for="name">姓名:</label>
        <input v-model="user.name" type="text" id="name" />

        <label for="email">邮箱:</label>
        <input v-model="user.email" type="email" id="email" />

        <label for="gender">性别:</label>
        <select v-model="user.gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label for="birthday">生日:</label>
        <input v-model="user.birthday" type="date" id="birthday" />

        <label for="college">学院:</label>
        <input v-model="user.college" type="text" id="college" />

        <button type="submit">保存更改</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  birthday: '1990-01-01',
  college: 'Computer Science College'
});

const avatarUrl = ref('/path/to/default-avatar.png');

const handleAvatarChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = () => {
  // Here, you can handle the submit logic to save changes (e.g., call an API)
  console.log('User profile updated:', user.value);
};

// Simulate loading user data on mount (in real cases, you might fetch it from an API)
onMounted(() => {
  console.log('User Profile Loaded');
});
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


</style>




