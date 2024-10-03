<script setup>
import { ref, onMounted, inject } from 'vue'

const cardColor = inject('cardColor')
const ipSource = ref(0)


/**
 * 功能描述：设置获取IP的来源网站
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const setIPSource = async () => {
  let result = await window.setApi.setIPSource(ipSource.value)
  if (result) {
    alert('设置成功')
  } else {
    alert('设置失败')
  }
}

/**
 * 功能描述：测试IP来源网站是否可用
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const testIPSource = async () => {
  let result = await window.setApi.testIPSource(ipSource.value)
  if (result) {
    alert('网站可用')
  } else {
    alert('无法连接到获取本机IP的网站')
  }
}

onMounted(async () => {
  let result = await window.setApi.getIPSource()
  ipSource.value = result || 0

})
</script>

<template>
  <div class="outer-container">
    <div class="ip-source-container">
      <n-radio-group v-model:value="ipSource" name="ip-source-options" class="radio-group">
        <n-radio class="radio-font" label="ipip-net" :value="0">ipip</n-radio>
        <n-radio class="radio-font" label="ipify-org" :value="1">ipify</n-radio>
        <n-radio class="radio-font" label="meitu-com" :value="2">meitu</n-radio>
        <n-radio class="radio-font" label="ip-api-com" :value="3">ip-api</n-radio>
        <!-- <n-radio label="custom-proxy" value="custom-proxy">自定义代理</n-radio> -->
      </n-radio-group>

      <div class="button-container">
        <n-button
          type="warning"
          round
          size="medium"
          class="ip-source-button ip-source-test-button"
          @click="testIPSource"
          >测试</n-button
        >
        <n-button
          type="success"
          round
          size="medium"
          class="ip-source-button ip-source-save-button"
          @click="setIPSource"
          >保存</n-button
        >
      </div>
    </div>
  </div>
</template>

<style>
.outer-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.ip-source-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: v-bind(cardColor);
}

.radio-group {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  gap: 10px;
}

.radio-font {
  font-size: 17px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.ip-source-button {
  font-size: 14px;
  padding: 8px 16px;
  line-height: 1.2;
}
</style>
