// api/windowControl.js
export const windowControl = {
    getApi(ipcRenderer) {
        return {
            close: () => ipcRenderer.invoke('close-settings-window')
        }
    }
}
