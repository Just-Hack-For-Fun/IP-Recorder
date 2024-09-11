<script setup>
import { inject, computed } from 'vue'

// 从上层继承值
const getMode = inject('isDarkMode')
let isDarkMode = getMode()
const toggleTheme = inject('toggleTheme')
const cardColor = inject('cardColor')

// 自定义颜色
const titleTextColor = computed(() => (isDarkMode.value ? '#E0E0E0' : '#333'))
const switchTextColor = computed(() => (isDarkMode.value ? '#4A90E2' : '#666'))

/**
 * 功能描述：切换主题
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const handleToggleTheme = () => {
  console.log(isDarkMode.value)
  isDarkMode.value = !isDarkMode.value
  toggleTheme()
}
</script>

<template>
  <div class="theme-settings-container">
    <div class="theme-card">
      <h2 class="theme-title">主题设置</h2>
      <div class="theme-switch-container">
        <span class="theme-label">亮色模式</span>
        <n-switch v-model:value="isDarkMode" size="large" @update:value="handleToggleTheme">
          <template #checked>
            <div class="switch-icon">🌙</div>
          </template>
          <template #unchecked>
            <div class="switch-icon">☀️</div>
          </template>
        </n-switch>
        <span class="theme-label">暗色模式</span>
      </div>
    </div>
  </div>
</template>

<style>
.theme-settings-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
}

.theme-card {
  background-color: v-bind(cardColor);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px 40px 40px 40px;
  max-width: 600px;
  text-align: center;
  transition: all 0.3s ease;
  /* box-sizing: border-box; */
}

.theme-title {
  font-size: 22px;
  color: v-bind(titleTextColor);
  margin-top: 20px;
  font-weight: 600;
}

.theme-switch-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.theme-label {
  font-size: 14px;
  color: v-bind(switchTextColor);
  transition: color 0.3s ease;
}

.switch-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>