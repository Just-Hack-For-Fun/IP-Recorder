import { BrowserWindow } from 'electron'
import { path } from 'path'

export class CommonWindow {
    constructor() {
        this.window = null
        this.defaultOptions = {
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: true
            }
        }
    }

    /**
     * 创建窗口
     * @param {Object} options - 窗口配置选项
     * @returns {BrowserWindow} 窗口实例
     */
    create(options = {}) {
        if (this.isCreated()) {
            return this.window
        }

        try {
            const mergedOptions = this.mergeOptions(options)
            this.window = new BrowserWindow(mergedOptions)
            this.setupWindowEvents()
            return this.window
        } catch (error) {
            console.error('Failed to create window:', error)
            throw new Error('Window creation failed')
        }
    }

    /**
     * 合并默认配置和用户配置
     * @param {Object} options
     */
    mergeOptions(options) {
        return {
            ...this.defaultOptions,
            ...options,
            webPreferences: {
                ...this.defaultOptions.webPreferences,
                ...options.webPreferences
            }
        }
    }

    /**
     * 设置窗口事件监听
     */
    setupWindowEvents() {
        if (!this.window) return

        this.window.on('closed', () => {
            this.window = null
        })

        this.window.on('unresponsive', () => {
            console.warn('Window became unresponsive')
        })

        this.window.webContents.on('crashed', () => {
            console.error('Window crashed')
        })
    }

    /**
     * 向窗口发送消息
     * @param {string} channel - 消息通道
     * @param {...any} args - 消息参数
     */
    send(channel, ...args) {
        try {
            if (!this.isCreated()) return false
            this.window.webContents.send(channel, ...args)
            return true
        } catch (error) {
            console.error('Failed to send message:', error)
            return false
        }
    }

    /**
     * 获取窗口实例
     */
    getWindow() {
        return this.window
    }

    /**
     * 检查窗口是否已创建且未销毁
     */
    isCreated() {
        return !!this.window && !this.window.isDestroyed()
    }

    isVisible() {
        return !!this.window && this.window.isVisible()
    }

    /**
     * 执行窗口操作
     * @param {Function} action - 要执行的操作
     */
    async executeWindowAction(action) {
        if (!this.isCreated()) return false
        try {
            await action()
            return true
        } catch (error) {
            console.error(`Window action failed:`, error)
            return false
        }
    }

    async center() {
        return this.executeWindowAction(() => this.window.center())
    }

    async focus() {
        return this.executeWindowAction(() => this.window.focus())
    }

    async minimize() {
        return this.executeWindowAction(() => this.window.minimize())
    }

    async hide() {
        return this.executeWindowAction(() => this.window.hide())
    }

    async show() {
        if (this.isCreated()) {
            return this.executeWindowAction(() => this.window.show())
        }
        try {
            this.create()
            return true
        } catch {
            return false
        }
    }

    /**
     * 关闭窗口
     */
    async close() {
        if (!this.isCreated()) return true

        try {
            await this.executeWindowAction(() => this.window.close())
            this.window = null
            return true
        } catch (error) {
            console.error('Failed to close window:', error)
            return false
        }
    }

    /**
     * 销毁窗口实例
     */
    destroy() {
        if (!this.isCreated()) return

        try {
            this.window.destroy()
            this.window = null
        } catch (error) {
            console.error('Failed to destroy window:', error)
        }
    }
}

export default CommonWindow
