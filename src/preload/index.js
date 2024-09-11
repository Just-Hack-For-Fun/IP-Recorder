import { contextBridge, ipcRenderer } from 'electron'

const startRecord = () => ipcRenderer.invoke('start-record')
const pauseRecord = () => ipcRenderer.invoke('pause-record')
const resumeRecord = () => ipcRenderer.invoke('resume-record')
const stopRecord = () => ipcRenderer.invoke('stop-record')
const getCurrentIPInfo = () => ipcRenderer.invoke('get-current-ip')
const hasHistroy = () => ipcRenderer.invoke('has-history')
const delHistory = () => ipcRenderer.invoke('del-history')
const openSettingsWindow = () => ipcRenderer.invoke('open-setting-window')

const onThemeChange = (callback) => {
  ipcRenderer.on('toggle-theme-render', (event, isDarkMode) => {
    callback(isDarkMode)
  })
}

const getIpRecord = () => ipcRenderer.invoke('get-ip-record')

contextBridge.exposeInMainWorld('api', {
  startRecord,
  pauseRecord,
  resumeRecord,
  stopRecord,
  getCurrentIPInfo,
  hasHistroy,
  delHistory,
  openSettingsWindow,
  onThemeChange,
  getIpRecord,
})
