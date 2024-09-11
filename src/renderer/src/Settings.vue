<script setup>
import OptionsSide from './components/settings/OptionsSide.vue'
import SettingDefaultPage from './components/settings/SettingDefaultPage.vue'
import ProxyPanel from './components/settings/ProxyPanel.vue'
import RequestOptionsPanel from './components/settings/RequestOptionsPanel.vue'
import DarkMode from './components/settings/DarkMode.vue'
import { ref, provide, onMounted, computed } from 'vue'
import { darkTheme } from 'naive-ui'

const currentComponent = ref(SettingDefaultPage)
const isDarkMode = ref(null)

onMounted(async () => {
  isDarkMode.value = await window.setApi.getThemeMode()
})

const optionClick = (key) => {
  switch (key) {
    case 'proxy-setting':
      currentComponent.value = ProxyPanel
      return
    case 'http-request':
      currentComponent.value = RequestOptionsPanel
      return
    case 'dark-mode':
      currentComponent.value = DarkMode
      return
  }
}

const cardColor = computed(() => (isDarkMode.value ? '1C1C23' : '#ffffff'))
provide('isDarkMode', () => isDarkMode)
provide('toggleTheme', () => {
  isDarkMode.value = !isDarkMode.value
  window.setApi.toggleTheme(isDarkMode.value)
})
provide('cardColor', cardColor)

</script>

<template>
  <n-config-provider :theme="isDarkMode ? darkTheme : null">
    <n-space vertical>
      <n-layout>
        <n-layout has-sider>
          <n-layout-sider bordered :width="140" :native-scrollbar="false">
            <OptionsSide @menu-click="optionClick"></OptionsSide>
          </n-layout-sider>
          <n-layout-content>
            <div>
              <component :is="currentComponent" />
            </div>
          </n-layout-content>
        </n-layout>
      </n-layout>
    </n-space>
  </n-config-provider>
</template>