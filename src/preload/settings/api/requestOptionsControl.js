export const requestOptionsControl = {
    getApi(ipcRenderer) {
        return {
            getReqOptions: () => ipcRenderer.invoke('get-request-options'),
            saveReqOptions: (data) => ipcRenderer.invoke('save-request-options', data)
        }
    }
}
