<script setup>
import { IosSettings as Settings } from '@vicons/ionicons4'
import { DocumentExport as Export } from '@vicons/carbon'

/**
 * 功能描述：打开设置窗口
 * 参数说明：无
 * 返回值：无
 * 注意事项：
 */
const openSettingsWindow = () => {
  window.api.openSettingsWindow()
}

/**
 * 功能描述：导出当前记录结果
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const exportResult = async () => {
  let ipRecordData = await window.api.getIpRecord()
  exportToCSV(ipRecordData)
}

/**
 * 功能描述：将数据存储到CSV文件中
 * 参数说明：data
  [
        {
          ip: xxx,
          location: xxx,
          startTime: xxx,
          endTime xxx:
        },
        {
          ip: xxx,
          location: xxx,
          startTime: xxx,
          endTime xxx:
        },
    ]
 * 返回值：无
 * 注意事项：
 */
const exportToCSV = (data) => {
  const headers = ['开始时间', '结束时间', 'IP地址', 'IP归属地']
  const csvContent = [
    headers.join(','),
    ...data.map((item) => [item.startTime, item.endTime, item.ip, item.location].join(','))
  ].join('\n')

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const filename = `ip_record_${year}${month}${day}.csv`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="function-container">
    <div class="function-item" @click="openSettingsWindow">
      <n-icon class="function-icon" size="28">
        <Settings />
      </n-icon>
      <div class="function-text">程序设置</div>
    </div>
    <div class="function-separator"></div>
    <div class="function-item" @click="exportResult">
      <n-icon class="function-icon" size="24">
        <Export />
      </n-icon>
      <div class="function-text">导出结果</div>
    </div>
  </div>
</template>

<style lang="css">
.function-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 174.5px;
}

.function-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
}

.function-item:active {
  background-color: #d0d0d0;
  transform: scale(0.98);
}

.function-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}

.function-text {
  font-size: 18px;
  user-select: none;
  cursor: pointer;
}

.function-separator {
  width: 80%;
  height: 1px;
  background-color: #ddd;
  margin: 2px 0;
}
</style>
