import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ...
    [vue()],
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
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
