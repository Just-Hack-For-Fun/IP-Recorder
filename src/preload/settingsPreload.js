import { contextBridge, ipcRenderer } from 'electron'

/**
 * 功能描述：设置程序使用的代理
 * 参数说明：proxy
    {
      proxyType: proxyType.value,
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
 * 返回值：Boolean
 * 注意事项：无
 */
const setProxy = (proxy) => {
  proxy = JSON.stringify(proxy)
  return ipcRenderer.invoke('set-proxy', proxy)
}

/**
 * 功能描述：获取程序代理配置
 * 参数说明：无
 * 返回值：proxy
    {
      proxyType: proxyType.value,
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
const getProxy = async () => {
  let proxyStr = await ipcRenderer.invoke('get-proxy')
  let proxy = JSON.parse(proxyStr)
  return proxy
}

/**
 * 功能描述：测试代理可用性
 * 参数说明：proxy
    {
      proxyType: proxyType.value,
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
 * 返回值：Boolean
 * 注意事项：
 */
const testProxy = async (proxy) => {
  proxy = JSON.stringify(proxy)
  return ipcRenderer.invoke('test-proxy', proxy)
}

/**
 * 功能描述：获取程序请求配置
 * 参数说明：无
 * 返回值：result
    {
      "retryCount": 5,
      "interval": 500,
      "theme": null
    } 
 * 注意事项：无
 */
const getReqOptions = async () => {
  let result = await ipcRenderer.invoke('get-req-options')
  result = JSON.parse(result)
  return result
}

/**
 * 功能描述：设置程序请求配置
 * 参数说明：reqOptions
    { 
      "retryCount": 5,
      "interval": 500,
    } 
 * 返回值：无
 * 注意事项：无
 */
const setReqOptions = (reqOptions) => {
  reqOptions = JSON.stringify(reqOptions)
  return ipcRenderer.invoke('set-req-options', reqOptions)
}

// 切换主题
const toggleTheme = (isDarkMode) => ipcRenderer.invoke('toggle-theme', isDarkMode)

// 获取主题
const getThemeMode = async () => ipcRenderer.invoke('is-dark-mode')

// 获取 IP 来源网站配置
const getIPSource = async () => ipcRenderer.invoke('get-ip-source')

// 测试 IP 来源网站配置
const testIPSource = async (ipSource) => ipcRenderer.invoke('test-ip-source', ipSource)

// 设置 IP 来源网站配置
const setIPSource = async (ipSource) => ipcRenderer.invoke('set-ip-source', ipSource)


contextBridge.exposeInMainWorld('setApi', {
  setProxy,
  getProxy,
  testProxy,
  getReqOptions,
  setReqOptions,
  toggleTheme,
  getThemeMode,
  getIPSource,
  testIPSource,
  setIPSource
})
