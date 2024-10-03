import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
if (require('electron-squirrel-startup')) app.quit();
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const path = require('path')
let icon = path.join(__dirname, '../../resources/icon.png')
const { getIPInfo, getIPByIpIpNet, getIPByIpify, getIPByMeitu, getIPByIPApi, testProxy, testIPSource } = require(
  path.join(__dirname, '../../src/main/ipService')
)
const { recordIPChange, hasHistory, deleteHistory, getIpRecord } = require(
  path.join(__dirname, '../../src/main/store')
)
const {
  getSettings,
  updateProxySettings,
  updateReqSettings,
  checkReqOptions,
  checkProxy,
  getIPSource,
  setIPSource
} = require(path.join(__dirname, '../../src/main/config'))
// const squirrelStartup = require('electron-squirrel-startup')

// if (squirrelStartup) {
//   app.quit();
// }

icon = nativeImage.createFromPath(icon)
if (process.platform === 'darwin') {
  app.dock.setIcon(icon)
}

let mainWindow
let settingsWindow
let isMainDarkMode = false
let tray
let appIcon

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 580,
    height: process.platform === 'linux' ? 100 : 130,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    icon: appIcon,
    // ...(process.platform === 'linux' ? { appIcon } : {}),
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/index.js')
      // sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('close', (event) => {
    if (tray) {
      event.preventDefault()
      mainWindow.hide()
      if (settingsWindow && !settingsWindow.isDestroyed) {
        settingsWindow.hide()
      }
    }
  })

  mainWindow.on('closed', () => {
    // mainWindow.close()
    mainWindow = null
    if (settingsWindow && !settingsWindow.isDestroyed) {
      settingsWindow.close()
      settingsWindow = null
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

let isPaused = false
let intervalId

/**
 * 功能描述：开始记录当前使用的IP
 * 参数说明：无
 * 返回值：无
 * 注意事项：默认情况下不使用代理
 */
const startRecord = async () => {
  // 按下开始按钮后，先执行一次，之后再进入循环
  try {
    let ipInfo
    if (!isPaused) {
      ipInfo = await getIPInfo()
      recordIPChange(ipInfo)
    }

    // 进入循环执行
    intervalId = setInterval(async () => {
      if (!isPaused) {
        ipInfo = await getIPInfo()
        recordIPChange(ipInfo)
      }
    }, 60 * 1000) // 每分钟检查一次当前IP
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

/**
 * 功能描述：暂停记录
 * 参数说明：无
 * 返回值：true
 * 注意事项：
 */
const pauseRecord = async () => {
  isPaused = true
  return true
}

/**
 * 功能描述：继续记录
 * 参数说明：无
 * 返回值：true
 * 注意事项：
 */
const resumeRecord = async () => {
  isPaused = false
  return true
}

/**
 * 功能描述：停止记录
 * 参数说明：无
 * 返回值：true
 * 注意事项：
 */
const stopRecord = async () => {
  clearInterval(intervalId)
  return true
}

/**
 * 功能描述：获取当前IP信息
 * 参数说明：无
 * 返回值：{ ipinfo: ipInfo1, issame: false }
 * 注意事项：
 */
const getCurrentIPInfo = async () => {
  let result = await getIPInfo()
  result = JSON.stringify(result)
  return result
}

/**
 * 功能描述：打开设置窗口
 * 参数说明：无
 * 返回值：true
 * 注意事项：
 */
const createSettingsWindow = () => {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    if (settingsWindow.isMinimized()) {
      settingsWindow.restore()
    }
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: process.platform === 'linux' ? 260 : 280,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.resolve(__dirname, '../preload/settingsPreload.js')
    }
  })

  settingsWindow.on('ready-to-show', () => {
    settingsWindow.show()
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/' + 'settings.html')
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/settings.html'))
  }
}

/**
 * 功能描述：设置程序使用的代理
 * 参数说明：proxy
    {
      proxyType: 'custom-proxy',
      proxyConfig: {
        protocol: socks5,
        host: 127.0.0.1,
        port: 1080,
        auth: {
          username: admin,
          password: pass
        }
      }
    } 
 * 返回值：Boolean
 * 注意事项：
 */
const setProxy = async (proxy) => {
  proxy = checkProxy(proxy)
  if (!proxy) {
    return false
  }
  updateProxySettings(proxy)
  return true
}

/**
 * 功能描述：获取程序设置的代理
 * 参数说明：无
 * 返回值：proxy
    {
      proxyType: 'custom-proxy',
      proxyConfig: {
        protocol: socks5,
        host: 127.0.0.1,
        port: 1080,
        auth: {
          username: admin,
          password: pass
        }
      }
    } 
 * 注意事项：
 */
const getProxy = () => {
  let settings = getSettings()
  let proxy = JSON.stringify(settings.proxy)
  return proxy
}

/**
 * 功能描述：获取程序请求配置
 * 参数说明：无
 * 返回值：reqOptions
    {
      "retryCount": 5,
      "interval": 500,
      "theme": null
    } 
 * 注意事项：无
 */
const getReqOptions = () => {
  let settings = getSettings()
  let reqOptions = {
    retryCount: settings.retryCount,
    interval: settings.interval
  }
  reqOptions = JSON.stringify(reqOptions)
  return reqOptions
}

/**
 * 功能描述：设置程序请求配置
 * 参数说明：reqOptions
    { 
      "retryCount": 5,
      "interval": 500,
    } 
 * 返回值：无
 * 注意事项：无
 */
const setReqOptions = (reqOptions) => {
  reqOptions = checkReqOptions(reqOptions)
  updateReqSettings(reqOptions)
  return true
}

// 用于通知主窗口更新当前IP地址以及归属地信息，主要用于在每次配置更改时更新信息
const updateCurrentIPInfo = async () => mainWindow.webContents.send('update-current-info')


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  switch (process.platform) {
    case 'win32':
      appIcon = path.join(__dirname, '../../resources/icon.ico')
      break
    case 'linux':
      appIcon = path.join(__dirname, '../../resources/icon.png')
      break
    case 'darwin':
      appIcon = path.join(__dirname, '../../resources/icon.icns')
      break
    default:
      appIcon = path.join(__dirname, '../../resources/icon.png')
  }
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.ip-recorder.id')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 各种来自前端的 ipc 请求
  ipcMain.handle('start-record', startRecord)
  ipcMain.handle('pause-record', pauseRecord)
  ipcMain.handle('resume-record', resumeRecord)
  ipcMain.handle('stop-record', stopRecord)
  ipcMain.handle('get-current-ip', getCurrentIPInfo)
  ipcMain.handle('has-history', hasHistory)
  ipcMain.handle('del-history', deleteHistory)
  ipcMain.handle('open-setting-window', createSettingsWindow)

  ipcMain.handle('set-proxy', async (event, proxyData) => {
    let result = await setProxy(proxyData)
    if (result) {
      updateCurrentIPInfo()
    }
    return result
  })

  ipcMain.handle('get-proxy', getProxy)
  ipcMain.handle('test-proxy', (event, proxyData) => {
    return testProxy(proxyData)
  })

  ipcMain.handle('get-req-options', getReqOptions)
  ipcMain.handle('set-req-options', async (event, reqOptions) => {
    return setReqOptions(reqOptions)
    
  })

  ipcMain.handle('toggle-theme', (event, isDarkMode) => {
    if (mainWindow) {
      isMainDarkMode = isDarkMode
      mainWindow.webContents.send('toggle-theme-render', isDarkMode)
    }
  })

  ipcMain.handle('is-dark-mode', () => isMainDarkMode)
  ipcMain.handle('get-ip-record', () => getIpRecord())

  ipcMain.handle('get-ip-source', () => getIPSource() )
  ipcMain.handle('test-ip-source', (event, ipSource) => {
    return testIPSource(ipSource)
  })

  ipcMain.handle('set-ip-source', (event, ipSource) => {
    let result = setIPSource(ipSource)
    if (result) {
      updateCurrentIPInfo()
    }
    return result
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // 托盘图标尺寸
  const traySize = {
    width: 18,
    height: 18
  }
  let trayIcon = icon.resize(traySize)
  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow.show()
        if (settingsWindow && !settingsWindow.isDestroyed) {
          console.log('settingWindow show 1')
          settingsWindow.show()
        }
      }
    },
    { label: '退出', click: () => app.quit() }
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('NOP IP Record')

  tray.on('click', () => {
    mainWindow.show()
    if (settingsWindow && !settingsWindow.isDestroyed) {
      settingsWindow.show()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (tray) {
    tray.destroy()
    tray = null
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
