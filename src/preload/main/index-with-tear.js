const { contextBridge, ipcRenderer } = require('electron')
const { ipHandler } = require('./api/ipHandler')
const { windowControl } = require('./api/windowControl')
const { recordControl } = require('./api/recordControl')

/**
 * 创建完整的 API 对象
 */
function createAPI() {
    return {
        ...ipHandler.getApi(ipcRenderer),
        ...windowControl.getApi(ipcRenderer),
        ...recordControl.getApi(ipcRenderer)
    }
}

/**
 * 设置所有事件监听器
 */
function setupListeners() {
    ipHandler.setupIPUpdate(ipcRenderer)
}

/**
 * 初始化函数
 */
function initialize() {
    try {
        setupListeners()
        const api = createAPI()

        if (process.contextIsolated) {
            try {
                contextBridge.exposeInMainWorld('api', api)
            } catch (error) {
                console.error(error)
            }
        } else {
            // window.electron = electronAPI
            window.api = api
        }
    } catch (error) {
        console.error('Preload initialization failed:', error)
        throw error
    }
}

// 执行初始化
initialize()
