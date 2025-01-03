import { ipcMain } from 'electron'
import { settingsHandlers } from '../ipc/handlers/settingsHandlers.mjs'
import { proxyHandlers } from '../ipc/handlers/proxyHandlers.mjs'
import { apiSourceHandlers } from '../ipc/handlers/apiSourceHandlers.mjs'
import { requestOptionsHandlers } from '../ipc/handlers/requestOptionsHandlers.mjs'
import { recordHandlers } from '../ipc/handlers/recordHandlers.mjs'

export const setupIPC = () => {
    const handlers = {
        'open-settings-window': settingsHandlers.openSetting,
        'close-settings-window': settingsHandlers.closeSetWin,
        'min-main-window': settingsHandlers.minMainWindow,
        'close': settingsHandlers.closeMainWin,

        'has-history': recordHandlers.hasHistory,
        'reset-record': recordHandlers.resetRecord,
        'export-record': recordHandlers.exportRecord,
        'get-ip-info': recordHandlers.updateCurrentInfo,

        'get-proxy': proxyHandlers.getProxy,
        'test-proxy': proxyHandlers.testProxy,
        'save-proxy': proxyHandlers.saveProxy,

        'get-api-source': apiSourceHandlers.getApiSource,
        'test-api-source': apiSourceHandlers.testApiSource,
        'save-api-source': apiSourceHandlers.saveApiSource,

        'get-request-options': requestOptionsHandlers.getReqOptions,
        'save-request-options': requestOptionsHandlers.saveReqOptions
    }

    Object.entries(handlers).forEach(([channel, handler]) => {
        ipcMain.handle(channel, handler)
    })
}
