<script setup>
import { ref, onMounted, inject } from 'vue'

const retryCount = ref('')
const interval = ref('')
const cardColor = inject('cardColor')

/**
 * 功能描述：设置程序请求配置
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const setReqOptions = async () => {
  let reqOptions = {
    retryCount: retryCount.value,
    interval: interval.value
  }

  let result = await window.setApi.setReqOptions(reqOptions)
  console.log(result)
}

onMounted(async () => {
  let reqOptions = await window.setApi.getReqOptions()
  retryCount.value = reqOptions.retryCount || retryCount.value
  interval.value = reqOptions.interval || interval.value
  console.log(reqOptions)
})
</script>

<template>
  <div class="outer-container">
    <div class="request-options-container">
      <n-flex class="flex-item">
        <n-input-group>
          <n-input-group-label class="flex-item-text" size="small"
            >请求失败重新尝试</n-input-group-label
          >
          <n-input
            v-model:value="retryCount"
            class="flex-item-text"
            :style="{ width: '45px', 'text-align': 'center' }"
            placeholder=""
            size="small"
          />
          <n-input-group-label class="flex-item-text" size="small">次</n-input-group-label>
        </n-input-group>
      </n-flex>

      <n-flex class="flex-item">
        <n-input-group>
          <n-input-group-label class="flex-item-text" size="small"
            >请求时间间隔</n-input-group-label
          >
          <n-input
            v-model:value="interval"
            class="flex-item-text"
            :style="{ width: '60px', 'text-align': 'center' }"
            placeholder=""
            size="small"
          />
          <n-input-group-label class="flex-item-text" size="small">毫秒</n-input-group-label>
        </n-input-group>
      </n-flex>

      <div class="request-save-container">
        <n-button
          type="success"
          round
          size="medium"
          class="request-options-save"
          @click="setReqOptions"
          >保存</n-button
        >
      </div>
    </div>
  </div>
</template>

<style>
.request-options-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* background-color: blue; */
  gap: 10px;
  background-color: v-bind(cardColor);
}

.flex-item {
  display: flex;
  align-items: center;
}

.flex-item-text {
  font-size: 14px;
}

.request-save-container {
  margin-top: 10px;
}
</style>
