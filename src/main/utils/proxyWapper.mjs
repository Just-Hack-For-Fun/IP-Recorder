import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

// 封装代理配置函数
export function createAxiosConfig(proxyType, customProxyConfig = null) {
    const baseConfig = {
        timeout: 5000,
        maxRedirects: 5
    }

    switch (proxyType) {
        case 0: // 无代理
            return {
                ...baseConfig,
                proxy: false,
                httpAgent: null,
                httpsAgent: null
            }

        case 1: // 系统代理
            return {
                ...baseConfig
            }

        case 2: // 自定义代理
            if (!customProxyConfig) {
                throw new Error('Custom proxy config is required')
            }

            const { protocol, host, port, auth } = customProxyConfig
            let agent

            // 构建代理URL
            const getProxyUrl = () => {
                const proto = protocol === 0 ? 'socks5' : protocol === 1 ? 'http' : 'https'

                if (auth && auth.username && auth.password) {
                    return `${proto}://${auth.username}:${auth.password}@${host}:${port}`
                }
                return `${proto}://${host}:${port}`
            }

            // 创建对应的agent
            if (protocol === 0) {
                agent = new SocksProxyAgent(getProxyUrl())
            } else if (protocol === 1) {
                agent = new HttpProxyAgent(getProxyUrl())
            } else {
                agent = new HttpsProxyAgent(getProxyUrl())
            }

            return {
                ...baseConfig,
                httpAgent: agent,
                httpsAgent: agent,
                proxy: undefined // 关键：使用agent时不设置proxy
            }

        default:
            throw new Error('Invalid proxy type')
    }
}
