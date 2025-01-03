import axios from 'axios'
import { createAxiosConfig } from '../utils/proxyWapper.mjs'
import { getConfig } from '../stores/configStore.mjs'
import { getCurrentTime } from '../utils/times.mjs'
import { response } from '../utils/response.mjs'
import { MainWindow } from '../windows/mainWindow.mjs'

// 获取 IP 归属地的辅助函数
const getLocationByIP = async (ip) => {
    try {
        const { data } = await axios.post(
            'https://ip.taobao.com/outGetIpInfo',
            new URLSearchParams({ ip, accessKey: 'alibaba-inc' }),
            {
                headers: {
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'cache-control': 'no-cache',
                    origin: 'https://ip.taobao.com',
                    referer: 'https://ip.taobao.com/ipSearch',
                    'user-agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
                }
            }
        )

        if (data.data?.country && data.data?.city) {
            return `${data.data.country}-${data.data.city}`
        }
        return null
    } catch (error) {
        return null
    }
}

// API 配置
const API_CONFIGS = {
    0: {
        name: 'ipipnet',
        url: 'https://myip.ipip.net/json',
        parse: (data) => {
            if (!data?.data?.location || !Array.isArray(data.data.location)) {
                return response.error('数据格式异常')
            }

            return response.success({
                ip: data.data.ip || '未获取到IP',
                location: data.data.location.filter(Boolean).join('-')
            })
        }
    },

    1: {
        name: 'ipify',
        url: 'https://api.ipify.org/?format=json',
        parse: async (data) => {
            if (!data?.ip) {
                return response.error('数据格式异常')
            }

            const ip = data.ip
            let location = null
            let retryCount = 3

            while (retryCount > 0) {
                location = await getLocationByIP(ip)
                if (location) {
                    return response.success({
                        ip,
                        location
                    })
                }
                retryCount--
                if (retryCount > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
            }

            return response.error('获取IP归属地失败')
        }
    },

    2: {
        name: 'baidu',
        url: 'https://qifu-api.baidubce.com/ip/local/geo/v1/district',
        parse: (data) => {
            if (!data?.code || data.code !== 'Success') {
                return response.error('数据格式异常')
            }

            return response.success({
                ip: data.ip || '未获取到IP',
                location: [data.data.country, data.data.prov, data.data.city, data.data.isp]
                    .filter(Boolean)
                    .join('-')
            })
        }
    },

    3: {
        name: 'ip-api',
        url: 'http://demo.ip-api.com/json/?lang=zh-CN',
        parse: (data) => {
            if (!data?.status || data.status !== 'success') {
                return response.error('数据格式异常')
            }

            return response.success({
                ip: data.query || '未获取到IP',
                location: `${data.country}-${data.regionName}-${data.city}`
            })
        }
    }
}

// 重试逻辑封装
const withRetry = async (fn, retryCount = 3, delay = 800) => {
    let lastError

    for (let i = 0; i <= retryCount; i++) {
        try {
            // console.log(`尝试第 ${i + 1} 次`)
            const result = await fn()
            // console.log('请求结果:', result)
            // console.log('当前时间:', getCurrentTime())
            return result
        } catch (error) {
            lastError = error
            if (i < retryCount) {
                await new Promise((resolve) => setTimeout(resolve, delay))
            }
        }
    }

    throw lastError
}

// 获取 IP 信息
const getInfoWithOpts = async (options = {}) => {
    try {
        const { data: defaultConfig } = getConfig()
        const config = { ...defaultConfig, ...options }
        const { apiSource, proxy } = config

        const apiConfig = API_CONFIGS[apiSource]
        if (!apiConfig) {
            return response.error('不支持的 API 来源')
        }

        const axiosConfig = createAxiosConfig(proxy.type, proxy.data)

        const result = await withRetry(async () => {
            const { data } = await axios.get(apiConfig.url, axiosConfig)
            return apiConfig.parse(data)
        }, config.retryCounts)

        return result
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '网络请求失败'
        return response.error(errorMessage)
    }
}

// 更新当前信息
const updateCurrentInfo = async () => {
    const result = await getInfoWithOpts()
    if (result.code === 0) {
        return MainWindow.window.webContents.send('ip-updated', result.data)

    }

    return MainWindow.window.webContents.send('ip-updated', null)
}

export { getInfoWithOpts, updateCurrentInfo }
