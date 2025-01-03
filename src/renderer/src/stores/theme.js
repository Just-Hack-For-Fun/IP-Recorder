// stores/theme.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)

  const handleStorageChange = (event) => {
    if (event.key === 'theme-storage') {
      const newState = JSON.parse(event.newValue)
      isDark.value = newState.isDark
      applyTheme()
    }
  }

  const initThemeSync = () => {
    // 初始化时应用主题
    applyTheme()
    window.addEventListener('storage', handleStorageChange)
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  }

  return {
    isDark,
    toggleTheme,
    applyTheme,
    initThemeSync
  }
}, {
  persist: {
    key: 'theme-storage',
    storage: localStorage,
    paths: ['isDark']
  }
})
