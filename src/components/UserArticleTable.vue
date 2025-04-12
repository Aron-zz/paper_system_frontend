<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Article Count</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in pagedUsers" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.articles }}</td>
        <td><button @click="selectUser(user)">Select</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { computed } from 'vue';

// 接收父组件的 props
const props = defineProps({
  users: Array,
  currentPage: Number,
});

// 触发用户选择事件
const emit = defineEmits(['select-user']);

// 分页数据
const pageSize = 3; // 每页显示3个用户

const pagedUsers = computed(() => {
  return props.users.slice((props.currentPage - 1) * pageSize, props.currentPage * pageSize);
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
</style>
