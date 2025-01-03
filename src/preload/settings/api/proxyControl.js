export const proxyControl = {
    getApi(ipcRenderer) {
        return {
            getProxy: () => ipcRenderer.invoke('get-proxy'),
            testProxy: (data) => ipcRenderer.invoke('test-proxy', data),
            saveProxy: (data) => ipcRenderer.invoke('save-proxy', data)
        }
    }
}
