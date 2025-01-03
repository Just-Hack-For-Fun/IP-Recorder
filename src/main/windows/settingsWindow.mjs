import { is } from '@electron-toolkit/utils'
import { shell } from 'electron'
import { join } from 'path'
import { CommonWindow } from './commonWindow.mjs'
import { getDirName } from '../utils/paths.mjs'
import icon from '../../../build/icon.png?asset'

const currentDir = getDirName(import.meta.url)

class SettingsWindowClass extends CommonWindow {
    static #instance = null

    /**
     * 默认窗口配置
     */
    #defaultConfig = {
        width: 600,
        height: 222,
        show: false,
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        backgroundColor: '#00000000',
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(currentDir, '../preload/settings/index.js'),
            // contextIsolation: true,
            // sandbox: true
        }
    }

    constructor() {
        if (SettingsWindowClass.#instance) {
            return SettingsWindowClass.#instance
        }
        super()
        SettingsWindowClass.#instance = this
    }

    /**
     * 设置窗口事件监听
     */
    #setupWindowEvents(window) {
        window.on('ready-to-show', () => {
            window.show()
        })

        window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        // 可以添加关闭时的处理
        // window.on('close', () => {
        //     // 保存设置等
        //     this.saveSettings()
        // })
    }

    /**
     * 加载窗口内容
     */
    async #loadContent(window) {
        try {
            if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
                const url = `${process.env['ELECTRON_RENDERER_URL']}/src/settings/settings.html`
                await window.loadURL(url)
            } else {
                const filePath = join(currentDir, '../renderer/src/settings/settings.html')
                await window.loadFile(filePath)
            }
        } catch (error) {
            console.error('Failed to load settings content:', error)
            throw error
        }
    }

    /**
     * 创建设置窗口
     */
    create() {
        try {
            const window = super.create(this.#defaultConfig)
            window.shadow = true
            this.#setupWindowEvents(window)
            this.#loadContent(window)
            return window
        } catch (error) {
            console.error('Failed to create settings window:', error)
            throw error
        }
    }

    /**
     * 创建或聚焦窗口
     */
    async createOrFocus() {
        try {
            if (this.isCreated()) {
                const window = this.getWindow()

                if (window.isMinimized()) {
                    window.restore()
                }

                await this.center()
                window.focus()
                // return window
            }

            return this.create()
        } catch (error) {
            console.error('Failed to create or focus settings window:', error)
            throw error
        }
    }

    /**
     * 重写销毁方法，清理单例
     */
    destroy() {
        super.destroy()
        SettingsWindowClass.#instance = null
    }
}

// 创建单例并导出
const settingsWindow = new SettingsWindowClass()
export { settingsWindow as SettingsWindow }
