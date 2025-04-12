<template>
  <div class="user-info">
    <img :src="user.avatar" alt="User Avatar" />
    <div>
      <h3>{{ user.name }}</h3>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>College:</strong> {{ user.college }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: Object
});
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.user-info img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin-right: 20px;
}

.user-info div {
  font-size: 16px;
}
</style>
