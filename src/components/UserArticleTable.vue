<template>
  <table>
    <thead>
      <tr>
        <th>Username</th>
        <th>Article Count</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <!-- 如果没有用户数据，显示提示信息 -->
      <tr v-if="pagedUsers.length === 0">
        <td colspan="3" style="text-align: center;">No users available</td>
      </tr>
      <!-- 显示分页后的用户列表 -->
      <tr v-for="user in pagedUsers" :key="user.userId">
        <td>{{ user.username }}</td>
        <td>{{ user.paperCount }}</td>
        <td><button @click="selectUser(user)">Select</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';

// 接收父组件的 props
const props = defineProps({
  users: {
    type: Array,
    default: () => [], // 默认值为空数组
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 3, // 默认每页3个用户
  },
});

// 触发用户选择事件
const emit = defineEmits(['select-user']);

// 分页数据
const pagedUsers = computed(() => {
  if (!props.users || props.users.length === 0) {
    return []; // 如果没有用户数据，返回空数组
  }
  return props.users.slice((props.currentPage - 1) * props.pageSize, props.currentPage * props.pageSize);
});

// 选择用户
const selectUser = (user) => {
  emit('select-user', user);
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
