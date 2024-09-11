const axios = require('axios')
const { getSettings, checkProxy } = require('./config')
const { SocksProxyAgent } = require('socks-proxy-agent')
const { HttpsProxyAgent } = require('https-proxy-agent')
const { HttpProxyAgent } = require('http-proxy-agent')

/**
 * 功能描述：构建 Agent
 * 参数说明：proxyConfig
      {
        protocol: socks5,
        host: 127.0.0.1,
        port: 1080,
        auth: {
          username: admin,
          password: pass
        }
      }
 * 返回值：Agent 
 * 注意事项：
 */
const buildAgent = (proxyConfig) => {
  let agent
  let socksUrl

  if (proxyConfig) {
    switch (proxyConfig.protocol) {
      case 'socks5':
        socksUrl = `socks5://${proxyConfig.auth.username}:${proxyConfig.auth.password}@${proxyConfig.host}:${proxyConfig.port}`
        agent = new SocksProxyAgent(socksUrl)
        break
      case 'http':
        agent = new HttpProxyAgent({
          host: proxyConfig.host,
          port: proxyConfig.port,
          auth: `${proxyConfig.auth.username}:${proxyConfig.auth.password}`
        })
        break
      case 'https':
        agent = new HttpsProxyAgent({
          host: proxyConfig.host,
          port: proxyConfig.port,
          auth: `${proxyConfig.auth.username}:${proxyConfig.auth.password}`
        })
        break
      default:
        throw new Error('不支持的代理协议')
    }
  }

  return agent
}

/**
 * 功能描述：获取请求配置，包括代理以及请求失败后的重传配置
 * 参数说明：customProxy
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
 * 返回值：Object { axiosProxy, retryCount, interval }
 * 注意事项：无
 */
const getReqConfig = (customProxy) => {
  let settings = getSettings()
  let retryCount = settings.retryCount
  let interval = settings.interval
  let axiosProxy = {}
  let agent

  let proxy = customProxy || settings.proxy
  if (proxy) {
    let proxyType = proxy.proxyType
    let proxyConfig

    switch (proxyType) {
      case 'no-proxy':
        proxyConfig = false
        break
      case 'system-proxy':
        proxyConfig = undefined
        break
      case 'custom-proxy':
        proxyConfig = proxy.proxyConfig
        agent = buildAgent(proxyConfig)
        proxyConfig = undefined
        break
      default:
        // console.log(proxy)
        throw new Error('Unsupported proxy type')
    }

    axiosProxy = {
      httpAgent: agent,
      httpsAgent: agent,
      proxy: proxyConfig
    }
  }

  return { axiosProxy, retryCount, interval }
}

/**
 * 这是个用来获取本机IP地址以及位置信息的程序工厂，方便后续大家自定义获取IP的途径
 * @param {*} url 获取本机IP的url
 * @param {*} parseResult 用于解析请求结果的函数
 * @returns 均返回一个对象 { ip: '223.104.38.136', location: '中国 北京 北京  移动' }
 */
const ipFactory = async (url, parseResult, customProxy) => {
  const { axiosProxy, retryCount, interval } = getReqConfig(customProxy)

  let retries = 0
  while (retries <= retryCount) {
    try {
      const response = await axios.get(url, axiosProxy)
      let ipInfo = parseResult(response.data)
      return ipInfo
    } catch (error) {
      console.error('Error fetching IP location:', error)
      retries++
      if (retries <= retryCount) {
        console.log(`Retry ${retries} in ${interval}ms...`)
        await new Promise((resolve) => setTimeout(resolve, interval))
      } else {
        throw error
      }
    }
  }
}

/**
 * 功能描述：通过 ipip.net 获取本机IP信息
 * 参数说明：无
 * 返回值：ipInfo { ip: xxx, location: xxx }
 * 注意事项：无
 */
const getIPByIpIpNet = async () => {
  const parseIPInfo = (data) => {
    const regex = /当前 IP：(\S+)\s+来自于：(.+)/
    const match = data.match(regex)

    if (match) {
      return {
        ip: match[1],
        location: match[2].trim()
      }
    } else {
      return null
    }
  }

  let ipInfo = await ipFactory('https://myip.ipip.net', parseIPInfo)
  return ipInfo
}

/**
 * 功能描述：通过 ipify.org 获取本机IP信息
 * 参数说明：无
 * 返回值：ipInfo { ip: xxx, location: xxx }
 * 注意事项：无
 */
const getIPByIpify = async () => {
  const parseIPInfo = async (data) => {
    let ip = data.ip
    let location
    const response = await axios.post(
      'https://ip.taobao.com/outGetIpInfo',
      new URLSearchParams({
        ip: `${ip}`,
        accessKey: 'alibaba-inc'
      }),
      {
        headers: {
          accept: '*/*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'bx-v': '2.5.14',
          'cache-control': 'no-cache',
          cookie:
            'cna=ckQrH6jzrkACAW/JHWrMhaQN; thw=cn; t=fe8732f0280ea8b1f50bdc525127f11f; XSRF-TOKEN=c18fdea2-8407-4263-ae63-710ddcb8843b; xlly_s=1; tfstk=ffZntcTOtfOXt0pRtlmCyWdCXrQtdBiSW7K-w0hP7fl_pberw0VuZ7cKz6iLq5VLUHadR4hkEDZTJ3hdO02zM0fAMiIYdJiI4sCvv6bAXDMoLQ-ywc8ZFADbYxIYdJ9NC9ubqiLoGXnOZbPr8cSZefkyL7leQODreB8yY7yNIYGwYekr8VkZ3xLrp2QEiurTb6y7FgtjBpZZK2ck2XKoMlKx5j5-_3K-tv03JJlM43ra5TG0QjjM_fezhzugq_ArVRU0ZzPNuF037JEZkuCwVXUzQrMuV_sgZJz4aXENg3c8lk4xl2JDmR24krugVitIYrwTjqEe__Mg7-NS32A95SyTHkg_qsAZNyHjbv2hxFcUJ8qKluf6Yjza950YXCKf4ZYwuxMHVAW8bUTS8AMiGOn1NYXKaGwNIOYfF2kspjBGIU9K8AMGtOXMl6uECvtd.',
          origin: 'https://ip.taobao.com',
          pragma: 'no-cache',
          priority: 'u=1, i',
          referer: 'https://ip.taobao.com/ipSearch',
          'sec-ch-ua': '"Not)A;Brand";v="99", "Microsoft Edge";v="127", "Chromium";v="127"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
          'x-requested-with': 'XMLHttpRequest'
        }
      }
    )

    if (response.data.data && response.data.data.country && response.data.data.city) {
      location = response.data.data.country + '-' + response.data.data.city
    }

    let ipInfo = { ip: ip, location: location }
    return ipInfo
  }

  let ipInfo = await ipFactory('https://api.ipify.org/?format=json', parseIPInfo)
  return ipInfo
}

/**
 * 功能描述：测试代理可用性
 * 参数说明：proxy
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
 * 返回值：Boolean
 * 注意事项：
 */
const testProxy = async (proxy) => {
  proxy = checkProxy(proxy)
  const { axiosProxy, retryCount, interval } = getReqConfig(proxy)

  let retries = 0
  while (retries <= retryCount) {
    try {
      await axios.get('https://api.ipify.org/?format=json', axiosProxy)
      await axios.get('https://myip.ipip.net', axiosProxy)
      return true
    } catch (error) {
      console.error('Error fetching IP location:', error)
      retries++
      if (retries <= retryCount) {
        console.log(`Retry ${retries} in ${interval}ms...`)
        await new Promise((resolve) => setTimeout(resolve, interval))
      } else {
        return false
      }
    }
  }
}

/**
 * 功能描述：获取当前IP信息
 * 参数说明：无
 * 返回值：{ ipinfo: ipInfo1, issame: false }
 * 注意事项：无
 */
const getIPInfo = async () => {
  try {
    let ipInfo1 = await getIPByIpIpNet()
    let ipInfo2 = await getIPByIpify()

    let result = { ipinfo: ipInfo1, issame: false }

    if (ipInfo1.ip === ipInfo2.ip) {
      result.issame = true
    }

    return result
  } catch (error) {
    console.error('Error fetching IP location:', error)
    throw error
  }
}

module.exports = {
  getIPInfo,
  getIPByIpIpNet,
  getIPByIpify,
  testProxy
}
