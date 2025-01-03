// 用于处理IP相关的 ipc api
export const ipHandler = {
    // 通过自定义事件的方式让渲染进程实时更新IP信息
    setupIPUpdate(ipcRenderer) {
        ipcRenderer.on('ip-updated', (_event, data) => {
            // 触发自定义事件，将数据传递给渲染进程
            window.dispatchEvent(new CustomEvent('ip-update', { detail: data }))
        })
    },

    getApi(ipcRenderer) {
        return {
            updateIPInfo: () => ipcRenderer.invoke('get-ip-info')
        }
    }
}
