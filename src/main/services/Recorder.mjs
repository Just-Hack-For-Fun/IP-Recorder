import { addRecord } from '../stores/recorderStore.mjs'
import { response } from '../utils/response.mjs'
import { getInfoWithOpts } from './ipService.mjs'
import { MainWindow } from '../windows/mainWindow.mjs'
import { print } from '../utils/debugConsole.mjs'
import { getInterval, subscribeIntervalChange } from '../stores/configStore.mjs'

class Recorder {
    #timer = null
    #isRunning = false
    #currentRecord = null
    #lastError = null
    #interval = null
    #unsubscribe = null

    constructor() {
        this.#setupIntervalSubscription()
    }

    #setupIntervalSubscription() {
        this.#unsubscribe = subscribeIntervalChange((newConfig, oldConfig) => {
            if (this.#isRunning && newConfig.interval !== oldConfig.interval) {
                this.#updateInterval(newConfig.interval)
            }
        })
    }

    #updateInterval(newInterval) {
        // print(`Updating check interval to ${newInterval}ms`)

        if (this.#timer) {
            clearInterval(this.#timer)
            this.#interval = newInterval
            this.#timer = setInterval(() => this.checkIP(), this.#interval)
        }
    }

    #notifyIPChange(data) {
        MainWindow.window.webContents.send('ip-updated', data)
    }

    #handleNewIPRecord(data) {
        if (!this.#currentRecord) {
            // 首次记录
            this.#currentRecord = data
            // addRecord(this.#currentRecord)
            this.#notifyIPChange(data)
            // return
        }

        // IP 变化时更新记录
        if (this.#currentRecord.ip !== data.ip) {
            // addRecord(this.#currentRecord)
            this.#currentRecord = data
            // addRecord(this.#currentRecord)
            this.#notifyIPChange(data)
        }

        addRecord(this.#currentRecord)
    }

    #initializeTimer() {
        const interval = getInterval()
        this.#interval = interval.data
        this.#timer = setInterval(() => this.checkIP(), this.#interval)
    }

    async start() {
        if (this.#isRunning) {
            return response.error('记录器已在运行中')
        }

        try {
            const result = await this.checkIP()
            if (result.code === -1) {
                return response.error(result.message)
            }

            this.#isRunning = true
            this.#initializeTimer()
            return response.success()
        } catch (error) {
            console.error(error)
            return response.error(error.message || '启动过程发生错误')
        }
    }

    pause() {
        if (!this.#isRunning) {
            return response.error('未处于记录状态')
        }

        if (this.#timer) {
            clearInterval(this.#timer)
            this.#timer = null
        }
        this.#isRunning = false

        if (this.#currentRecord?.ip) {
            addRecord(this.#currentRecord)
            this.#currentRecord = null
        }

        return response.success()
    }

    async resume() {
        if (this.#isRunning) return response.success()
        return this.start()
    }

    stop() {
        this.pause()
        this.#currentRecord = null
        this.#lastError = null
        return response.success()
    }

    async checkIP() {
        try {
            const result = await getInfoWithOpts()

            if (result.code === -1) {
                this.#lastError = result.message
                return response.error(result.message)
            }

            this.#lastError = null
            this.#handleNewIPRecord(result.data)
            return response.success(result.data)
        } catch (error) {
            console.error('Failed to fetch IP:', error)
            this.#lastError = error.message
            return response.error(error.message)
        }
    }

    getStatus() {
        return {
            isRunning: this.#isRunning,
            currentRecord: this.#currentRecord,
            lastError: this.#lastError,
            interval: this.#interval
        }
    }

    destroy() {
        this.#unsubscribe?.()
        this.stop()
    }
}

// 单例模式
const recorder = new Recorder()
export default recorder
