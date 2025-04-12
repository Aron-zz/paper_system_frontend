import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 将 router 实例传递给 Vue 应用
createApp(App).use(router).mount('#app')
