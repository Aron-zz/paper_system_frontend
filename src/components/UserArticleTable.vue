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
      <tr v-if="users.length === 0">
        <td colspan="3" style="text-align: center;">No users available</td>
      </tr>
      <tr v-for="user in users" :key="user.userId">
        <td>{{ user.username }}</td>
        <td>{{ user.paperCount }}</td>
        <td><button @click="selectUser(user)">Select</button></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select-user']);

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
