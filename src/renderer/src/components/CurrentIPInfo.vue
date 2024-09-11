<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentIP = ref('正在获取IP地址...')
const location = ref('正在获取IP归属地...')
const warning = ref('')
let intervalId

onMounted(() => {
  updateIP()
  intervalId = setInterval(updateIP, 30 * 1000) // 每30秒检查一次
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const updateIP = async () => {
  let result = await window.api.getCurrentIPInfo()
  result = JSON.parse(result)
  let ipInfo = result.ipinfo
  let issame = result.issame
  currentIP.value = ipInfo.ip ? ipInfo.ip : '未获取到IP'
  location.value = ipInfo.location ? ipInfo.location : '未获取到IP归属地'

  if (!issame) {
    warning.value = '结果不一致，以上为 ipip.net 返回的结果'
  } else {
    warning.value = ''
  }
}
</script>

<template>
  <div class="current-ip-info-container">
    <div class="current-ip">{{ currentIP }}</div>
    <div class="ip-info-separator"></div>
    <div class="current-location">{{ location }}</div>
    <div class="warning-message" v-if="warning">{{ warning }}</div>
  </div>
</template>

<style lang="css">
.current-ip-info-container {
  display: flex;
  flex-direction: column;
  width: 231px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.current-ip {
  font-size: 18px;
}

.current-location {
  font-size: 16px;
}

.ip-info-separator {
  margin-top: 2px;
  margin-bottom: 2px;
  width: 70%;
  height: 1px;
  background-color: #ddd;
}

.warning-message {
  position: absolute;
  bottom: -20px;
  font-size: 10px;
  color: #888;
  text-align: center;
}
</style>