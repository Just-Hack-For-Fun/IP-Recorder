// 用于存储配置项的 store
import Store from 'electron-store'
// import { response } from '../utils/response.mjs'
import { response } from '../utils/response.mjs'

const STORE_CONFIG = {
    encryptionKey: 'ip-recorder-secret',
    name: 'config',
    fileExtension: 'conf',
    defaults: {
        proxy: {
            type: 0, // 0: 无代理 、 1: 系统代理 、 2: 自定义代理
            data: {
                protocol: 0, // 0: SOCKS5 、 1: HTTP 、 2: HTTPS
                host: '',
                port: '',
                auth: null
                // auth: {
                //     username: '', // 非必须
                //     password: '' // 非必须
                // }
            }
        },
        apiSource: 0,
        retryCounts: 2,
        interval: 10000
    }
}

class ConfigStore {
    constructor() {
        this.store = new Store(STORE_CONFIG)
    }

    getConfig = () => response.success(this.store.get())

    getProxy = () => {
        const proxy = this.store.get('proxy', null)
        return proxy ? response.success(proxy) : response.error('未设置代理')
    }

    getApiSource = () => {
        const apiSource = this.store.get('apiSource', null)
        return [0, 1, 2, 3].includes(apiSource)
            ? response.success(apiSource)
            : response.error('未选择api数据源')
    }

    getRetryCounts = () => {
        return response.success(this.store.get('retryCounts', null))
    }

    getInterval = () => {
        return response.success(this.store.get('interval', null))
    }

    getReqOptions = () => {
        const retryCounts = this.store.get('retryCounts', null)
        const interval = this.store.get('interval', null)
        return response.success({ retryCounts, interval })
    }

    /**
     * 设置代理信息
     * @param {object} proxy API 来源类型
     * @returns 标准return
     */
    setProxy = (proxy) => {
        try {
            // 基础验证
            if (!proxy || typeof proxy !== 'object') {
                return response.error('无效的代理配置')
            }

            // 类型验证
            const type = Number(proxy.type)
            if (![0, 1, 2].includes(type)) {
                return response.error('无效的代理类型')
            }

            // 如果类型不是 0（不使用代理）， 1（系统代理），则验证必要字段
            if (type !== 0 && type !== 1) {
                if (!proxy.data?.host || !proxy.data?.port) {
                    return response.error('代理服务器地址和端口不能为空')
                }

                // 验证端口范围
                const port = Number(proxy.data.port)
                if (isNaN(port) || port < 1 || port > 65535) {
                    return response.error('无效的端口号')
                }

                // 验证协议类型（如果有）
                if (proxy.data.protocol !== undefined) {
                    const protocol = Number(proxy.data.protocol)
                    if (![0, 1, 2].includes(protocol)) {
                        return response.error('无效的协议类型')
                    }
                }
            }

            // 格式化数据
            const sanitizedProxy = {
                type,
                data:
                    type === 0 || type === 1
                        ? null
                        : {
                              host: String(proxy.data.host).trim(),
                              port: String(proxy.data.port).trim(),
                              protocol: Number(proxy.data?.protocol || 0),
                              auth: proxy.data?.auth
                                  ? {
                                        username: String(proxy.data.auth.username || '').trim(),
                                        password: String(proxy.data.auth.password || '').trim()
                                    }
                                  : undefined
                          }
            }

            // 写入配置
            this.store.set('proxy', sanitizedProxy)
            return response.success(sanitizedProxy)
        } catch (error) {
            return response.error(error.message || '保存代理配置失败')
        }
    }

    /**
     * 设置 API 来源
     * @param {number} apiSource API 来源类型
     * @returns {Promise<{code: number, data?: any, message?: string}>}
     */
    setApiSource = (apiSource) => {
        try {
            const source = Number(apiSource)
            if (![0, 1, 2, 3].includes(source)) {
                return response.error('无效的 API 来源类型')
            }

            this.store.set('apiSource', source)
            return response.success(source)
        } catch (error) {
            return response.error(error.message || '保存 API 来源配置失败')
        }
    }

    /**
     * 设置重试次数
     * @param {number} retryCounts 重试次数
     * @returns {Promise<{code: number, data?: any, message?: string}>}
     */
    setRetryCounts = (retryCounts) => {
        try {
            const counts = Number(retryCounts)
            if (isNaN(counts) || counts < 0 || counts > 10) {
                return response.error('无效的重试次数或重试次数大于10次')
            }

            this.store.set('retryCounts', counts)
            return response.success(counts)
        } catch (error) {
            return response.error(error.message || '保存重试次数失败')
        }
    }

    /**
     * 设置记录过程中请求间隔时间
     * @param {number} interval 间隔时间 毫秒
     * @returns {Promise<{code: number, data?: any, message?: string}>}
     */
    setReqInterval = (interval) => {
        try {
            const counts = Number(interval)
            if (isNaN(counts)) return response.error('无效的间隔时间')
            if (counts < 500) return response.error('间隔时间不得小于 500 毫秒')

            this.store.set('interval', counts)
            return response.success(counts)
        } catch (error) {
            return response.error(error.message || '保存间隔时间失败')
        }
    }

    /**
     *
     * @param {*} callback 当 interval 发生变化时调用的回调函数
     * @returns 返回的是取消监听的函数
     */
    subscribeIntervalChange = (callback) => {
        const unsubscribe = this.store.onDidChange('interval', (newValue, oldValue) => {
            callback({ interval: newValue }, { interval: oldValue })
        })
        return unsubscribe
    }
}

const configStore = new ConfigStore()

export const {
    getConfig,
    getProxy,
    getApiSource,
    getRetryCounts,
    getInterval,
    getReqOptions,
    setProxy,
    setApiSource,
    setRetryCounts,
    setReqInterval,
    subscribeIntervalChange
} = configStore
