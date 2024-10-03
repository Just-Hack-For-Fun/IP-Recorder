/**
 * 默认配置文件为
 * 不使用代理，失败重新尝试 5 次，每次间隔 0.5 秒
 */

/*
  ipSource:
    0 -> myip.ipip.net
    1 -> api.ipify.org
    2 -> webapi-pc.meitu.com
    3 -> demo.ip-api.com
*/

let settings = {
  proxy: {
    proxyType: 'no-proxy' // no-proxy | system-proxy | custom-proxy
  },
  retryCount: 5,
  interval: 500,
  theme: null,
  ipSource: 0,
}

/*
proxy 的结构

proxy = {
  proxyType: 'custom-proxy',
  proxyConfig: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  }
}

*/

/**
 * 功能描述：返回程序设置
 * 参数说明：无
 * 返回值：settings 定义如上
 * 注意事项：无
 */
const getSettings = () => {
  return settings
}

/**
 * 功能描述：更新程序代理配置
 * 参数说明：无
 * 返回值：无
 * 注意事项：
 */
const updateProxySettings = (newProxy) => {
  settings = {
    ...settings,
    proxy: {
      ...settings.proxy,
      ...newProxy
    }
  }
}

/**
 * 功能描述：更新程序请求配置
 * 参数说明：reqOptions
    { 
      "retryCount": 5,
      "interval": 500,
    }
 * 返回值：无
 * 注意事项：无
 */
const updateReqSettings = (reqOptions) => {
  settings.retryCount = reqOptions.retryCount || 5
  settings.interval = reqOptions.interval || 0
}

/**
 * 功能描述：对 IPC 传递过来的字符串进行处理并验证格式
 * 参数说明：IPC 传递过来的JSON字符串
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

 * 返回值：proxy 处理检查后的对象
 * 注意事项：
 */
const checkProxy = (proxy) => {
  proxy = JSON.parse(proxy)
  console.log(proxy)
  return proxy
}

/**
 * 功能描述：对 IPC 传递过来的字符串进行处理并验证格式
 * 参数说明：reqOptions IPC 传递过来的JSON字符串 
    { 
      "retryCount": 5,
      "interval": 500,
    }
 * 返回值：reqOptions 处理检查后的对象
 * 注意事项：
 */
const checkReqOptions = (reqOptions) => {
  reqOptions = JSON.parse(reqOptions)
  return reqOptions
}

/**
 * 功能描述：获取程序的 ipSource 配置值
 * 参数说明：无
 * 返回值：程序的 ipSource 配置值
 * 注意事项：无
 */
const getIPSource = () => {
  return settings.ipSource
}

/**
 * 功能描述：获取程序的 ipSource 配置值
 * 参数说明：无
 * 返回值：程序的 ipSource 配置值
 * 注意事项：无
 */
const setIPSource = (ipSource) => {
  settings.ipSource = ipSource
  return true
}


module.exports = {
  getSettings,
  updateProxySettings,
  updateReqSettings,
  checkReqOptions,
  checkProxy,
  getIPSource,
  setIPSource
}
