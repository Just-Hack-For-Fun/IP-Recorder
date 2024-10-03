<template>
  <n-menu
    :collapsed-width="64"
    :collapsed-icon-size="24"
    :options="menuOptions"
    icon-size="22"
    indent="22"
    @update:value="emitMenuClick"
  />
</template>

<script setup>
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { ServerProxy as ProxySetting, ContentDeliveryNetwork } from '@vicons/carbon'
import { DarkTheme20Filled as DarkMode } from '@vicons/fluent'
import { TripOriginFilled } from '@vicons/material'

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const emit = defineEmits(['menu-click'])
const emitMenuClick = (key) => {
  emit('menu-click', key)
}

const menuOptions = [
  {
    label: '代理设置',
    key: 'proxy-setting',
    icon: renderIcon(ProxySetting)
  },
  {
    label: '数据接口',
    key: 'ip-source-setting',
    icon: renderIcon(TripOriginFilled)
  },
  {
    label: '请求设置',
    key: 'http-request',
    icon: renderIcon(ContentDeliveryNetwork)
    // disabled: true,
  },
  {
    label: '主题模式',
    key: 'dark-mode',
    icon: renderIcon(DarkMode)
  }
]
</script>
