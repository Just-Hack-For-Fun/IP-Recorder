const { contextBridge, ipcRenderer } = require('electron')
const { windowControl } = require('./api/windowControl')
const { proxyControl } = require('./api/proxyControl')
const { apiSourceControl } = require('./api/apiSourceControl')
const { requestOptionsControl } = require('./api/requestOptionsControl')


/**
 * 创建完整的 API 对象
 */
const createAPI = () => {
    return {
        ...windowControl.getApi(ipcRenderer),
        ...proxyControl.getApi(ipcRenderer),
        ...apiSourceControl.getApi(ipcRenderer),
        ...requestOptionsControl.getApi(ipcRenderer)
    }
}

const initialize = () => {
    try {
        console.log('Settings preload initializing...')
        const api = createAPI()

        if (process.contextIsolated) {
            try {
                // contextBridge.exposeInMainWorld('electron', electronAPI)
                contextBridge.exposeInMainWorld('api', api)
            } catch (error) {
                console.error(error)
            }
        } else {
            // window.electron = electronAPI
            window.api = api
        }
    } catch (error) {
        console.error('Settings preload initialization failed:', error)
        throw error
    }
}

initialize()
