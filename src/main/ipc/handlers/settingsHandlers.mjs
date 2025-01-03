import { SettingsWindow } from '../../windows/settingsWindow.mjs'
import { MainWindow } from '../../windows/mainWindow.mjs'
import { print } from '../../utils/debugConsole.mjs'

export const settingsHandlers = {
    openSetting: () => {
        SettingsWindow.createOrFocus()
    },
    closeSetWin: () => SettingsWindow?.close(),
    minMainWindow: () => MainWindow.minimize(),
    closeMainWin: () => {
        SettingsWindow?.close()
        MainWindow.hide()
    }
}
