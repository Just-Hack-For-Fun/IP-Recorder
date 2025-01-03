// 用于处理记录相关的 ipc api
export const recordControl = {
    getApi(ipcRenderer) {
        return {
            start: () => ipcRenderer.invoke('start-record'),
            pause: () => ipcRenderer.invoke('pause-record'),
            resume: () => ipcRenderer.invoke('resume-record'),
            stop: () => ipcRenderer.invoke('stop-record'),
            hasHistory: () => ipcRenderer.invoke('has-history'),
            export: () => ipcRenderer.invoke('export-record'),
            resetRecord: () => ipcRenderer.invoke('reset-record')
        }
    }
}
