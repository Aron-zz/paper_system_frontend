import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home/Home.vue'
import UserManagement from '../views/Home/UserManagement.vue'
import ArticleManagement from '../views/Home/ArticleManagement.vue'
import UserProfile from '../views/Home/UserProfile.vue'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPassword from '../views/ResetPassword.vue'
import CompleteProfile from '../views/CompleteProfile.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/reset-password', component: ResetPassword },
  { path: '/complete-profile', component: CompleteProfile },

  {
    path: '/home',
    component: Home,
    children: [
      { path: '', redirect: 'user-profile' }, // 默认跳转到个人主页
      { path: 'user-profile', component: UserProfile },
      { path: 'user-management', component: UserManagement },
      { path: 'article-management', component: ArticleManagement },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
