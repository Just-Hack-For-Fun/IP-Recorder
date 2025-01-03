import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { MainWindow } from './windows/mainWindow.mjs'
import { TrayManager } from './system/tray.mjs'
import { setupIPC } from './system/ipcSetup.mjs'
import recorderController from './controllers/recorderController.mjs'
import { print } from './utils/debugConsole.mjs'
import { SettingsWindow } from './windows/settingsWindow.mjs'

const initialize = () => {
    electronApp.setAppUserModelId('com.ip-recorder.id')

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    MainWindow.create()
    TrayManager.createTray()
    setupIPC()
    recorderController.init()
}

const setupAppEvents = () => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            MainWindow.create()
        }
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('before-quit', async (event) => {
        event.preventDefault()
        try {
            recorderController.destroy()
            TrayManager.destroy()

            if (SettingsWindow?.isCreated()) {
                SettingsWindow?.destroy()
            }
            if (MainWindow?.isCreated()) {
                SettingsWindow.destroy()
            }
            app.exit(0)
        } catch (error) {
            console.error(error)
            app.exit(1)
        }

    })

    process.on('uncaughtException', (error) => {
        console.error('未捕获的异常:', error)
    })
}

app.whenReady()
    .then(() => {
        initialize()
        setupAppEvents()
    })
    .catch(console.error)
