<template>
  <Login v-if="mode === 'login'" @switch="mode = $event" />
  <Register v-if="mode === 'register'" @switch="mode = $event" />
  <ResetPassword v-if="mode === 'reset'" @switch="mode = $event" />
</template>

<script setup>
import { ref } from 'vue'
import Login from './Login.vue'
import Register from './Register.vue'
import ResetPassword from './ResetPassword.vue'

const mode = ref('login')
</script>
