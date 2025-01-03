export const apiSourceControl = {
    getApi(ipcRenderer) {
        return {
            getApiSource: () => ipcRenderer.invoke('get-api-source'),
            testApiSource: (data) => ipcRenderer.invoke('test-api-source', data),
            saveApiSource: (data) => ipcRenderer.invoke('save-api-source', data)
        }
    }
}
