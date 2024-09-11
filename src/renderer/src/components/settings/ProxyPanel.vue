<script setup>
import { ref, onMounted, inject } from 'vue'

const cardColor = inject('cardColor')

const proxyType = ref('')
const protocol = ref('')
const address = ref('')
const port = ref('')
const username = ref('')
const password = ref('')

const protocolOptions = [
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' },
  { label: 'SOCKS5', value: 'socks5' }
]

/**
 * 功能描述：根据当前代理设置信息创建代理配置对象
 * 参数说明：无
 * 返回值：Object
    {
      proxyType: 'custom-proxy',
      proxyConfig: {
        protocol: socks5,
        host: 127.0.0.1,
        port: 1080,
        auth: {
          username: admin,
          password: pass
        }
      }
    }
 
 * 注意事项：无
 */
const buildProxyObject = () => {
  let proxyObj = {
    proxyType: proxyType.value,
    proxyConfig: {
      protocol: protocol.value,
      host: address.value,
      port: port.value,
      auth: {
        username: username.value,
        password: password.value
      }
    }
  }

  return proxyObj
}

/**
 * 功能描述：设置程序代理
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const setProxy = async () => {
  let proxyObj = buildProxyObject()
  let result = await window.setApi.setProxy(proxyObj)
  if (result) {
    alert('代理设置成功')
  } else {
    alert('代理配置不合理')
  }
}

/**
 * 功能描述：测试代理可用性
 * 参数说明：无
 * 返回值：无
 * 注意事项：无
 */
const testProxy = async () => {
  let proxyObj = buildProxyObject()
  let result = await window.setApi.testProxy(proxyObj)
  if (result) {
    alert('代理可用')
  } else {
    alert('代理不可用')
  }
}

onMounted(async () => {
  let proxy = await window.setApi.getProxy()
  proxyType.value = proxy.proxyType

  if (proxyType.value === 'custom-proxy') {
    let config = proxy.proxyConfig
    protocol.value = config.protocol ? config.protocol : ''
    address.value = config.host ? config.host : ''
    port.value = config.port ? config.port : ''
    username.value = config.auth.username ? config.auth.username : ''
    password.value = config.auth.password ? config.auth.password : ''
  }
})
</script>

<template>
  <div class="outer-container">
    <div class="proxy-settings-container">
      <n-radio-group v-model:value="proxyType" name="proxy-options" class="radio-group">
        <n-radio label="no-proxy" value="no-proxy">无代理</n-radio>
        <n-radio label="system-proxy" value="system-proxy">系统代理</n-radio>
        <n-radio label="custom-proxy" value="custom-proxy">自定义代理</n-radio>
      </n-radio-group>

      <div v-if="proxyType === 'custom-proxy'" class="custom-proxy-settings">
        <n-select
          v-model:value="protocol"
          :options="protocolOptions"
          size="small"
          placeholder="协议"
          style="grid-column: span 2"
        />
        <div class="address-port-container">
          <n-input v-model:value="address" size="small" placeholder="地址" class="address-input" />
          <n-input v-model:value="port" size="small" placeholder="端口" class="port-input" />
        </div>
        <div class="user-pass-container">
          <n-input v-model:value="username" size="small" placeholder="账号（可选）" />
          <n-input
            v-model:value="password"
            type="password"
            size="small"
            placeholder="密码（可选）"
          />
        </div>
      </div>

      <div class="button-container">
        <n-button
          type="warning"
          round
          size="medium"
          class="proxy-button proxy-test-button"
          @click="testProxy"
          >测试</n-button
        >
        <n-button
          type="success"
          round
          size="medium"
          class="proxy-button proxy-save-button"
          @click="setProxy"
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

.proxy-settings-container {
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
}

.custom-proxy-settings {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  /* background-color: blue */
}

.address-port-container {
  display: grid;
  grid-template-columns: 2.8fr 1.2fr;
  gap: 12px;
}

.user-pass-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.proxy-button {
  font-size: 14px;
  padding: 8px 16px;
  line-height: 1.2;
}
</style>
