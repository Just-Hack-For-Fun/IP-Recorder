import { shell, app } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { CommonWindow } from './commonWindow.mjs'
import { getDirName } from '../utils/paths.mjs'
import icon from '../../../build/icon.png?asset'
import Main from 'electron/main'

const currentDir = getDirName(import.meta.url)

class MainWindow extends CommonWindow {
    static #instance = null

    /**
     * 默认窗口配置
     */
    #defaultConfig = {
        width: 500,
        height: 118,
        show: false,
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        backgroundColor: '#00000000',
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(currentDir, '../preload/main/index.js')
            // sandbox: false
        }
    }

    constructor() {
        if (MainWindow.#instance) {
            return MainWindow.#instance
        }
        super()
        MainWindow.#instance = this
        this.#setupAppEvents()
    }

    /**
     * 设置应用级事件监听
     */
    #setupAppEvents() {
        app.on('before-quit', () => {
            this.destroy()
        })

        app.on('activate', () => {
            if (this.isCreated() && !this.isVisible()) {
                this.show()
            } else if (!this.isCreated()) {
                this.create()
            }
        })
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
    }

    /**
     * 加载窗口内容
     */
    async #loadContent(window) {
        try {
            if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
                const url = `${process.env['ELECTRON_RENDERER_URL']}/src/main/main.html`
                // console.log('Loading dev URL:', url)
                await window.loadURL(url)
            } else {
                const filePath = join(currentDir, '../renderer/src/main/main.html')
                await window.loadFile(filePath)
            }
        } catch (error) {
            console.error('Failed to load window content:', error)
            throw error
        }
    }

    /**
     * 创建主窗口
     */
    create() {
        try {
            const window = super.create(this.#defaultConfig)
            window.shadow = true
            this.#setupWindowEvents(window)
            this.#loadContent(window)
            return window
        } catch (error) {
            console.error('Failed to create main window:', error)
            throw error
        }
    }

    /**
     * 重写销毁方法，清理单例
     */
    destroy() {
        super.destroy()
        MainWindow.#instance = null
    }

    /**
     * 获取单例
     */
    static getInstance() {
        if (!MainWindow.#instance) {
            MainWindow.#instance = new MainWindow()
        }
        return MainWindow.#instance
    }


}

// 创建单例并导出，保持与原代码相同的导出方式
const mainWindow = new MainWindow()
export { mainWindow as MainWindow }
