import { fileURLToPath } from 'url'
import { dirname } from 'path'

export function getDirName(importMetaUrl) {
    // 将 import.meta.url 转换为文件系统路径
    const __filename = fileURLToPath(importMetaUrl)
    // 获取文件所在的目录路径
    return dirname(__filename)
}
