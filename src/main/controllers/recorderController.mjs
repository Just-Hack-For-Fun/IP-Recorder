import { ipcMain } from 'electron'
import recorder from '../services/Recorder.mjs'
import { getConfig } from '../stores/configStore.mjs'
import { print } from '../utils/debugConsole.mjs'
import { response } from '../utils/response.mjs'


// 用于注册 record 相关 ipc 通信的类
class RecorderController {
    // 私有属性
    #handlers
    #registeredChannels = new Set()

    constructor() {
        // IPC 处理器映射表
        this.#handlers = {
            'get-recorder-status': () => recorder.getStatus(),
            'start-record': async () => {
                const config = getConfig()
                return await recorder.start(config)
            },
            'pause-record': async () => recorder.pause(),
            'resume-record': async () => recorder.resume(),
            'stop-record': async () => recorder.stop()
        }

        this.#setupIPCHandlers()
    }

    #setupIPCHandlers() {
        try {
            for (const [channel, handler] of Object.entries(this.#handlers)) {
                this.#registerHandler(channel, handler)
            }
            // print('IPC handlers setup completed')
        } catch (error) {
            console.error('Failed to setup IPC handlers:', error)
            throw error
        }
    }

    #registerHandler(channel, handler) {
        if (this.#registeredChannels.has(channel)) {
            console.warn(`Handler for channel '${channel}' is already registered`)
            return
        }

        ipcMain.handle(channel, async (event, ...args) => {
            try {
                // print(`Handling ${channel} request`)
                const result = await handler(...args)
                // print(`${channel} request completed`)
                return result
            } catch (error) {
                console.error(`Error handling ${channel}:`, error)
                return response.error(`执行 ${channel} 时发生错误: ${error.message}`)
            }
        })

        this.#registeredChannels.add(channel)
    }

    init() {
        try {
            // print('Recorder controller initialized successfully')
        } catch (error) {
            console.error('Failed to initialize recorder controller:', error)
            throw error
        }
    }

    destroy() {
        try {
            // print('Cleaning up recorder controller')
            // 移除所有注册的 IPC 处理器
            for (const channel of this.#registeredChannels) {
                ipcMain.removeHandler(channel)
            }
            this.#registeredChannels.clear()

            recorder.destroy()
            // print('Recorder controller cleanup completed')
        } catch (error) {
            console.error('Error during recorder controller cleanup:', error)
            // 即使清理出错也继续执行
        }
    }

    // 用于测试的方法
    isHandlerRegistered(channel) {
        return this.#registeredChannels.has(channel)
    }
}

const recorderController = new RecorderController()
export default recorderController
