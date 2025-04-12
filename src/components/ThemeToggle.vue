<template>
  <button @click="toggleTheme">切换主题</button>
</template>

<script setup>
const emit = defineEmits(['toggle'])

const toggleTheme = () => {
  emit('toggle')
}
</script>

<style scoped>
button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
