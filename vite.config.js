import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {  // 匹配所有以 /api 开头的请求
        target: 'http://localhost:8080',  // 后端地址
        changeOrigin: true,              // 修改请求头中的 Host 为目标地址
        rewrite: (path) => path.replace(/^\/api/, ''),  // 可选：移除 /api 前缀
      },
    },
  },
});