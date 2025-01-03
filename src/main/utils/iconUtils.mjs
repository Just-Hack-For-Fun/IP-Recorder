import winTrayIcon from '../../../build/tray-icons/win/tray-icon.ico?asset'
import macTrayIcon from '../../../build/tray-icons/mac/tray-icon.png?asset'
import linuxTrayIcon from '../../../build/tray-icons/linux/tray-icon.png?asset'

export const getTrayIconPath = () => {
    const icons = {
        darwin: macTrayIcon,
        win32: winTrayIcon,
        linux: linuxTrayIcon
    }
    return icons[process.platform] || linuxTrayIcon
}
