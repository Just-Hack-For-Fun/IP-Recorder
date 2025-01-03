// 用于处理窗口相关的 ipc api
export const windowControl = {
    getApi(ipcRenderer) {
        return {
            openSettings: () => ipcRenderer.invoke('open-settings-window'),
            close: () => ipcRenderer.invoke('quit'),
            minimize: () => ipcRenderer.invoke('min-main-window')
        }
    }
}
