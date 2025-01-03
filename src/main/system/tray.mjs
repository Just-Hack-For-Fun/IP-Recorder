import { app, Tray, Menu, nativeImage } from 'electron'
import { getTrayIconPath } from '../utils/iconUtils.mjs'
import { MainWindow } from '../windows/mainWindow.mjs'

export class TrayManager {
    static tray = null

    static createTray() {
        const trayIconPath = getTrayIconPath()
        const trayIcon = this.prepareTrayIcon(trayIconPath)

        try {
            this.tray = new Tray(trayIcon)
            this.setupTray()
        } catch (error) {
            console.error('Failed to create tray:', error)
            throw error
        }
    }

    static prepareTrayIcon(trayIconPath) {
        const icon = nativeImage.createFromPath(trayIconPath)
        if (process.platform === 'darwin') {
            app.dock.setIcon(icon)
        }
        return icon.resize({ width: 20, height: 20, quality: 'best' })
    }

    static setupTray() {
        this.tray.setToolTip('IP Recorder')
        this.tray.setContextMenu(this.createContextMenu())
        // this.tray.on('click', () => MainWindow.show())
    }

    static createContextMenu() {
        return Menu.buildFromTemplate([
            {
                label: '显示主窗口',
                click: () => MainWindow.show()
            },
            { type: 'separator' },
            {
                label: '退出',
                click: () => app.quit()
            }
        ])
    }

    static destroy() {
        if (this.tray) {
            this.tray.destroy()
            this.tray = null
        }
    }
}
