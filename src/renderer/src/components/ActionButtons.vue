<script setup>
import { computed, ref } from 'vue'
import { Play } from '@vicons/carbon'
import { PlayerStop, PlayerPause } from '@vicons/tabler'
import { RestartAltRound } from '@vicons/material'
import { createDiscreteApi, NButton } from 'naive-ui'
const { dialog } = createDiscreteApi(['dialog'])

// 停止按钮是否可用(可按)
const isDisabled = ref(true)

// 开始/暂停/继续 按钮的状态
const UNSTART = 0
const RECORDING = 1
const PAUSED = 2
const STOPED = 0
const startBtnStatus = ref(UNSTART)

// 各种状态下按钮的颜色
const startColor = '#68A527'
const pauseColor = '#F1AD4E'
const stopColor = '#E5532E'
const runningColor = '#8F7F7B'

// 使用计算属性实时更改两个按钮的颜色
const startBtnColor = computed(() => (startBtnStatus.value === 1 ? pauseColor : startColor))
const stopBtnColor = computed(() => (isDisabled.value ? runningColor : stopColor))

/**
 * 功能描述：开始记录当前使用的IP
 * 参数说明：无
 * 返回值：无
 * 注意事项：默认情况下不使用代理
 */
const startRecord = async () => {
  let hasHistory = await window.api.hasHistroy()
  let newStart

  if (hasHistory) {
    newStart = await resumeOrNewStart()

    if (newStart) {
      await window.api.delHistory()
    }

    if (newStart === undefined) {
      console.log('用户取消了操作')
      return
    }
  }

  let result = await window.api.startRecord()
  if (result) {
    startBtnStatus.value = RECORDING
    isDisabled.value = false
  } else {
    alert('请求失败，大概是没有网络')
  }
}

/**
 * 功能描述：暂停记录当前使用的IP
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const pauseRecord = async () => {
  let result = await window.api.pauseRecord()
  if (result) {
    startBtnStatus.value = PAUSED
  }
}

/**
 * 功能描述：继续记录
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const resumeRecord = async () => {
  let result = await window.api.resumeRecord()
  if (result) {
    startBtnStatus.value = RECORDING
  }
}

/**
 * 功能描述：停止记录
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const stopRecord = async () => {
  let result = await window.api.stopRecord()
  if (result) {
    isDisabled.value = true
    startBtnStatus.value = STOPED
  }
}

/**
 * 功能描述：用于决定重新开始记录还是继续记录
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const resumeOrNewStart = () => {
  return new Promise((resolve) => {
    dialog.warning({
      content: '存在历史记录，继续记录还是开始新记录？',
      positiveText: '继续记录',
      negativeText: '开启新记录',
      class: 'recording-choice-dialog',
      onPositiveClick: () => resolve(false),
      onNegativeClick: () => resolve(true),
      onMaskClick: () => resolve(undefined),
      onClose: () => resolve(undefined),
      showIcon: false
    })
  })
}
</script>

<template>
  <div class="action-container">
    <n-dialog-provider>
      <n-button
        v-if="startBtnStatus === UNSTART"
        class="action-button"
        :color="startBtnColor"
        circle
        @click="startRecord"
      >
        <template #icon>
          <n-icon size="35" color="white">
            <Play />
          </n-icon>
        </template>
      </n-button>
      <n-button
        v-else-if="startBtnStatus === RECORDING"
        class="action-button"
        :color="startBtnColor"
        circle
        @click="pauseRecord"
      >
        <template #icon>
          <n-icon size="35" color="white">
            <PlayerPause />
          </n-icon>
        </template>
      </n-button>
      <n-button
        v-else-if="startBtnStatus === PAUSED"
        class="action-button"
        :color="startBtnColor"
        circle
        @click="resumeRecord"
      >
        <template #icon>
          <n-icon size="35" color="white">
            <RestartAltRound />
          </n-icon>
        </template>
      </n-button>
    </n-dialog-provider>

    <n-button
      class="action-button"
      circle
      :color="stopBtnColor"
      :disabled="isDisabled"
      @click="stopRecord"
    >
      <template #icon>
        <n-icon size="35" color="white">
          <PlayerStop />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<style lang="css">
.action-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.action-button {
  width: 60px;
  height: 60px;
}

.recording-choice-dialog {
  width: 65vw;
  height: 84vh;
  padding: 4px 14px 10px 14px;
}
</style>
