import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    base: './',
    build: {
      outDir: 'dist/main'
    }
  },
  preload: {
    base: './',
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: {
          // 定义两个窗口的 Preload 脚本地址
          index: resolve(__dirname, 'src/preload/index.js'),
          settingsPreload: resolve(__dirname, 'src/preload/settingsPreload.js')
        }
      }
    }
  },
  renderer: {
    base: './',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        input: {
          // 定义两个窗口的窗口加载页面文件
          index: resolve(__dirname, 'src/renderer/index.html'),
          settings: resolve(__dirname, 'src/renderer/settings.html')
        }
      }
    }
  }
})
