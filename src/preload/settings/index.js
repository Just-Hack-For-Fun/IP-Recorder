const { contextBridge, ipcRenderer } = require('electron')
// import { electronAPI } from '@electron-toolkit/preload'


// Custom APIs for renderer
const api = {
    close: () => ipcRenderer.invoke('close-settings-window'),
    getProxy: () => ipcRenderer.invoke('get-proxy'),
    testProxy: (data) => ipcRenderer.invoke('test-proxy', data),
    saveProxy: (data) => ipcRenderer.invoke('save-proxy', data),
    getApiSource: () => ipcRenderer.invoke('get-api-source'),
    testApiSource: (data) => ipcRenderer.invoke('test-api-source', data),
    saveApiSource: (data) => ipcRenderer.invoke('save-api-source', data),
    getReqOptions: () => ipcRenderer.invoke('get-request-options'),
    saveReqOptions: (data) => ipcRenderer.invoke('save-request-options', data),
    updateIPInfo: () => ipcRenderer.invoke('get-ip-info')
}

// Use contextBridge APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
