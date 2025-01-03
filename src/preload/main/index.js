const { contextBridge, ipcRenderer } = require('electron')
// import { electronAPI } from '@electron-toolkit/preload'

// 通过自定义事件的方式让渲染进程实时更新IP信息
const setupIPUpdate = () => {
    // 监听主进程发来的IP更新信息
    ipcRenderer.on('ip-updated', (_event, data) => {
        // 触发自定义事件，将数据传递给渲染进程
        window.dispatchEvent(new CustomEvent('ip-update', { detail: data }))
    })
}

// Custom APIs for renderer
const api = {
    openSettings: () => ipcRenderer.invoke('open-settings-window'), // 打开设置窗口
    close: () => ipcRenderer.invoke('close'),
    minimize: () => ipcRenderer.invoke('min-main-window'),
    updateIPInfo: () => ipcRenderer.invoke('get-ip-info'),
    start: () => ipcRenderer.invoke('start-record'),
    pause: () => ipcRenderer.invoke('pause-record'),
    resume: () => ipcRenderer.invoke('resume-record'),
    stop: () => ipcRenderer.invoke('stop-record'),
    hasHistory: () => ipcRenderer.invoke('has-history'),
    export: () => ipcRenderer.invoke('export-record'),
    resetRecord: () => ipcRenderer.invoke('reset-record')
}

// Use contextBridge APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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

// 初始化监听
setupIPUpdate()
