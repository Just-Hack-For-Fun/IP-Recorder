<script setup>
import ActionButtons from './components/ActionButtons.vue'
import CurrentIPInfo from './components/CurrentIPInfo.vue'
import ConfigPanel from './components/ConfigPanel.vue'
import { darkTheme } from 'naive-ui'
import { onMounted, ref } from 'vue'

const theme = ref(null)

onMounted(() => {
  //
  window.api.onThemeChange((isDarkMode) => {
    theme.value = isDarkMode ? darkTheme : null
  })
})
</script>

<template>
  <n-config-provider :theme="theme">
    <!-- naive-ui 只有在部分组件下才可以实现黑暗主题，因此使用 n-card -->
    <n-card :bordered="false" class="theme-card">
      <div class="components-container">
        <div class="action-buttons-component">
          <ActionButtons></ActionButtons>
        </div>
        <div class="common-split-line split-line-1"></div>
        <div class="current-info-component">
          <CurrentIPInfo></CurrentIPInfo>
        </div>
        <div class="common-split-line split-line-2"></div>
        <div class="config-panel-component">
          <ConfigPanel></ConfigPanel>
        </div>
      </div>
    </n-card>
  </n-config-provider>
</template>

<style lang="css">
.theme-card {
  height: 100vh;
  border-radius: 0px;
}

.components-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.common-split-line {
  background-color: #ddd;
  height: 80vh;
  width: 1px;
  position: absolute;
}

.split-line-1 {
  left: 174.5px;
}

.split-line-2 {
  right: 174.5px;
}

.action-buttons-component {
  position: absolute;
  left: calc((174.5px - 140px) / 2);
}

.current-info-component {
  position: absolute;
  left: 174.5px;
}

.config-panel-component {
  position: absolute;
  right: 0px;
}
</style>
